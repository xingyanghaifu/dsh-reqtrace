/**
 * dsh-reqtrace — a requirement-to-evidence auditor for one DSH session.
 *
 * `/reqtrace` and the sidebar panel read the current session log, ask the
 * configured model to map each user requirement to tool evidence, and show a
 * compact report. The plugin never edits files, approves tools or changes the
 * session.
 */
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { auditSession, blocksText, extractRequirements, formatReport, parseReport, readEvents, shouldExtract } from './audit.js'
import { DEFAULT_CONFIG, readConfig, writeConfig } from './config.js'

export const name = 'reqtrace'
// No hard service dependency: the command appears when `commands` is composed,
// and the model/session lookups are optional at call time.
export const inject = []

// A finished turn with at least two tool calls is worth checking. This only
// marks the session; the model audit still waits for the user to open the panel.
const pendingAudits = new Map()
const toolCounts = new Map()
const autoAuditRuns = new Set()
const taskLedgers = new Map()
const extractionRuns = new Set()
const currentTurns = new Map()
const strictSteered = new Set()
const MAX_LEDGER_SESSIONS = 200

function trimTaskLedgers() {
  while (taskLedgers.size > MAX_LEDGER_SESSIONS) {
    let oldestId
    let oldestAt = Infinity
    for (const [id, ledger] of taskLedgers) {
      const at = Number(ledger?.at ?? 0)
      if (at < oldestAt) {
        oldestAt = at
        oldestId = id
      }
    }
    if (oldestId === undefined) break
    taskLedgers.delete(oldestId)
  }
}

function trimSessionMap(map, limit = 200) {
  while (map.size > limit) map.delete(map.keys().next().value)
}

let ledgerCache = null

function invalidateLedgerCache() {
  ledgerCache = null
}

function allLedgers() {
  if (ledgerCache !== null) return ledgerCache
  ledgerCache = [...taskLedgers.entries()]
    .flatMap(([sessionId, ledger]) => [
      { sessionId, ...ledger, id: `${sessionId}:${ledger.at ?? 'current'}` },
      ...(ledger.history ?? []).map((item) => ({ sessionId, ...item, id: `${sessionId}:${item.at ?? 'history'}` })),
    ])
    .sort((left, right) => (right.at ?? 0) - (left.at ?? 0))
  return ledgerCache
}

function formatHistory() {
  const ledgers = allLedgers().slice(0, 10)
  if (ledgers.length === 0) return '还没有历史任务清单。'
  return ['最近任务清单：', ...ledgers.flatMap((ledger, index) => [
    `${index + 1}. ${ledger.title ?? ledger.sessionId}（${(ledger.requirements ?? []).length} 条）`,
    ...(ledger.requirements ?? []).map((item) => `   - ${item}`),
  ])].join('\n')
}

function statusOfRequirement(report, text) {
  if (report === null || typeof report !== 'object') return '待核对'
  for (const [status, items] of [['已完成', report.done ?? []], ['部分完成', report.partial ?? []], ['缺失', report.missing ?? []]]) {
    if (items.some((item) => item.requirement === text)) return status
  }
  return '待核对'
}

/** Build the message that hands a historical checklist to the current agent. */
export function formatResumeMessage(ledger) {
  const requirements = (ledger.requirements ?? []).map((text, index) => `${index + 1}. [${statusOfRequirement(ledger.report, text)}] ${text}`)
  return [
    '[需求续接] 你正在继续一个历史任务。',
    `历史任务：${ledger.title ?? ledger.sessionId}`,
    ...(typeof ledger.request === 'string' && ledger.request.trim() !== '' ? ['', '原始请求：', ledger.request.trim()] : []),
    '',
    '需求清单：',
    ...requirements,
    '',
    '请先核对当前工作区，继续完成所有“缺失/部分完成/待核对”的需求；不要重复已完成部分。完成后给出每个需求的证据。',
  ].join('\n')
}

function formatResumeList() {
  const ledgers = allLedgers().slice(0, 10)
  if (ledgers.length === 0) return '还没有可续接的历史任务。'
  return [
    '可续接的历史任务：',
    ...ledgers.map((ledger, index) => `${index + 1}. ${ledger.title ?? ledger.sessionId}（${(ledger.requirements ?? []).length} 条）`),
    '',
    '输入 /reqtrace resume <序号> 继续。',
  ].join('\n')
}

export function apply(ctx) {
  let config = readConfig(ctx, DEFAULT_CONFIG)
  const logDebug = (message, error) => {
    try {
      ctx.logger?.debug?.(message, error)
    } catch {
      // Logging must never affect the plugin.
    }
  }
  const ledgerFile = typeof ctx.get?.('dshHomePath') === 'function'
    ? ctx.get('dshHomePath')('reqtrace', 'ledgers.json')
    : undefined

  const persistLedgers = async () => {
    invalidateLedgerCache()
    if (ledgerFile === undefined) return
    try {
      await mkdir(dirname(ledgerFile), { recursive: true })
      const recent = [...taskLedgers.entries()]
        .sort((left, right) => Number(right[1]?.at ?? 0) - Number(left[1]?.at ?? 0))
        .slice(0, 100)
      await writeFile(ledgerFile, JSON.stringify(Object.fromEntries(recent), null, 2), 'utf8')
    } catch (error) {
      logDebug('reqtrace: ledger persistence failed', error)
    }
  }

  if (ledgerFile !== undefined) {
    void (async () => {
      try {
        const stored = JSON.parse(await readFile(ledgerFile, 'utf8'))
        for (const [id, ledger] of Object.entries(stored)) {
          if (ledger === null || typeof ledger !== 'object' || !Array.isArray(ledger.requirements)) continue
          if (ledger.report?.raw !== undefined && (ledger.report.missing?.length ?? 0) === 0 && (ledger.report.partial?.length ?? 0) === 0 && (ledger.report.done?.length ?? 0) === 0) {
            const repaired = parseReport(ledger.report.raw)
            if (repaired.raw === undefined) ledger.report = { ...repaired, usage: ledger.report.usage }
          }
          taskLedgers.set(id, ledger)
        }
        trimTaskLedgers()
        invalidateLedgerCache()
      } catch (error) {
        logDebug('reqtrace: ledger load failed', error)
      }
    })()
  }

  const rememberReport = (sessionId, report) => {
    if (report === null || typeof report !== 'object') return
    const existing = taskLedgers.get(sessionId)
    const requirements = Array.isArray(existing?.requirements) && existing.requirements.length > 0
      ? existing.requirements
      : [...(report.missing ?? []), ...(report.partial ?? []), ...(report.done ?? [])].map((item) => item.requirement).filter(Boolean)
    taskLedgers.set(sessionId, {
      ...(existing ?? {}),
      requirements,
      report,
      at: Date.now(),
    })
    trimTaskLedgers()
    void persistLedgers()
  }

  const childLedgersFor = (session) => {
    try {
      const found = new Map()
      for (const child of ctx.get('sessions')?.list?.() ?? []) {
        if (child?.id === session?.id || child?.header?.parentSession !== session?.id) continue
        const ledger = taskLedgers.get(child.id)
        if (ledger !== undefined) found.set(child.id, { ...ledger, sessionId: child.id, title: child.title ?? ledger.title })
      }
      // Archived children may no longer be in sessions.list(); their ledgers
      // still carry parentSessionId from extraction.
      for (const [id, ledger] of taskLedgers) {
        if (ledger?.parentSessionId === session?.id) {
          if (!found.has(id)) found.set(id, { ...ledger, sessionId: id, title: ledger.title })
        }
      }
      return [...found.values()].filter((ledger) => Array.isArray(ledger.requirements) && ledger.requirements.length > 0)
    } catch {
      return []
    }
  }

  const beginTask = (session, text, seq) => {
    const previous = taskLedgers.get(session.id)
    if (previous === undefined || !Array.isArray(previous.requirements) || previous.requirements.length === 0) return
    if (typeof previous.seq === 'number' && typeof seq === 'number' && previous.seq === seq) return
    const history = [...(previous.history ?? []), {
      requirements: previous.requirements,
      report: previous.report ?? null,
      turn: previous.turn ?? null,
      at: previous.at ?? null,
      title: previous.title,
    }].slice(-20)
    taskLedgers.set(session.id, {
      requirements: [],
      request: text.slice(0, 4000),
      turn: currentTurns.get(session.id) ?? null,
      seq,
      at: Date.now(),
      title: typeof session.title === 'string' ? session.title : undefined,
      parentSessionId: session.header?.parentSession ?? null,
      subagent: session.header?.origin === 'subagent',
      delegationDepth: session.header?.delegationDepth ?? 0,
      report: null,
      history,
    })
    void persistLedgers()
  }

  const currentTaskFor = (session) => {
    const ledger = taskLedgers.get(session.id)
    if (ledger === undefined) return undefined
    try {
      const events = readEvents(session)
      const latestUser = [...events].reverse().find((event) => event?.type === 'user/message' && (event.surfaceOp === undefined || event.surfaceOp === 'append'))
      const text = blocksText(latestUser?.data?.content)
      if (latestUser !== undefined && (typeof ledger.seq !== 'number' || latestUser.seq > ledger.seq) && shouldExtract(text)) {
        beginTask(session, text, latestUser.seq)
        return taskLedgers.get(session.id)
      }
    } catch {
      // Fall back to the stored ledger if the session log is unavailable.
    }
    return ledger
  }

  const runExtraction = async (session, text, seq) => {
    const key = `${session.id}:${String(seq ?? '')}`
    if (extractionRuns.has(key)) return
    extractionRuns.add(key)
    try {
      const extracted = await extractRequirements(ctx, text, new AbortController().signal)
      const requirements = extracted.requirements
      if (requirements.length > 0) {
        const previous = taskLedgers.get(session.id)
        const history = previous === undefined || (previous.requirements?.length ?? 0) === 0
          ? (previous?.history ?? [])
          : [...(previous.history ?? []), {
            requirements: previous.requirements,
            report: previous.report ?? null,
            turn: previous.turn ?? null,
            at: previous.at ?? null,
            title: previous.title,
          }].slice(-20)
        taskLedgers.set(session.id, {
          requirements,
          request: text.slice(0, 4000),
          turn: currentTurns.get(session.id) ?? null,
          seq,
          at: Date.now(),
          title: typeof session.title === 'string' ? session.title : undefined,
          parentSessionId: session.header?.parentSession ?? null,
          subagent: session.header?.origin === 'subagent',
          delegationDepth: session.header?.delegationDepth ?? 0,
          extractionUsage: extracted.usage ?? null,
          history,
        })
        trimTaskLedgers()
        void persistLedgers()
      }
    } catch (error) {
      logDebug(`reqtrace: extraction failed for ${session.id}`, error)
    } finally {
      extractionRuns.delete(key)
    }
  }

  const runAutoAudit = async (session, turn) => {
    const key = `${session.id}:${String(turn ?? '')}`
    if (autoAuditRuns.has(key)) return
    autoAuditRuns.add(key)
    pendingAudits.set(session.id, { turn, at: Date.now() })
    trimSessionMap(pendingAudits)
    try {
      const report = await auditSession(ctx, session, new AbortController().signal, {
        turn,
        requirements: currentTaskFor(session)?.requirements ?? [],
        childLedgers: childLedgersFor(session),
      })
      if (typeof report !== 'string') rememberReport(session.id, report)
    } catch (error) {
      logDebug(`reqtrace: automatic audit failed for ${session.id}`, error)
    } finally {
      autoAuditRuns.delete(key)
    }
  }

  ctx.effect(() => {
    if (typeof ctx.on !== 'function') return undefined
    return ctx.on('session/event', (session, event) => {
      const id = session?.id
      if (typeof id !== 'string' || id === '') return
      if (event?.type === 'turn/start') {
        currentTurns.set(id, event.data?.turn)
        toolCounts.set(id, 0)
        trimSessionMap(currentTurns)
        trimSessionMap(toolCounts)
        return
      }
      if (event?.type === 'user/message') {
        if (config.autoExtract !== true || (event.surfaceOp !== undefined && event.surfaceOp !== 'append')) return
        const text = blocksText(event.data?.content)
        const titleFallback = typeof session.title === 'string' ? session.title : ''
        const extractionText = text.length >= 8 ? text : titleFallback
        if (!shouldExtract(extractionText)) return
        beginTask(session, extractionText, event.seq)
        if (config.autoExtract === true) void runExtraction(session, extractionText, event.seq)
        return
      }
      if (event?.type === 'tool/call') {
        toolCounts.set(id, (toolCounts.get(id) ?? 0) + 1)
        trimSessionMap(toolCounts)
        return
      }
      if (event?.type === 'turn/end') {
        const count = toolCounts.get(id) ?? 0
        toolCounts.delete(id)
        if (count >= config.minToolCalls && event.data?.reason?.kind !== 'error') {
          if (config.autoAudit === true) void runAutoAudit(session, event.data?.turn)
          else {
            pendingAudits.set(id, { turn: event.data?.turn, at: Date.now() })
            trimSessionMap(pendingAudits)
          }
        }
      }
    })
  }, 'reqtrace: pending audits')

  ctx.effect(() => {
    if (typeof ctx.on !== 'function') return undefined
    return ctx.on('session/disposed', (session) => {
      const id = session?.id
      if (typeof id !== 'string') return
      pendingAudits.delete(id)
      toolCounts.delete(id)
      currentTurns.delete(id)
      for (const key of strictSteered) {
        if (key.startsWith(`${id}:`)) strictSteered.delete(key)
      }
    })
  }, 'reqtrace: session cleanup')

  ctx.effect(() => {
    if (typeof ctx.on !== 'function') return undefined
    return ctx.on('agent/turn-stopping', async ({ agent, turn }) => {
      if (config.strict !== true || typeof agent?.steer !== 'function') return
      const session = agent.session
      if (session === undefined) return
      // A delegated child reports to its parent; steering it here would create
      // competing gates. Only the root session owns the strict decision.
      if (session.header?.origin === 'subagent' || session.header?.parentSession !== undefined) return
      const report = await auditSession(ctx, session, new AbortController().signal, {
        turn,
        requirements: currentTaskFor(session)?.requirements ?? [],
        childLedgers: childLedgersFor(session),
      })
      if (typeof report !== 'string') rememberReport(session.id, report)
      if (typeof report === 'string' || report.missing.length === 0) return
      const key = `${session.id}:${String(turn ?? '')}`
      if (strictSteered.has(key)) return
      strictSteered.add(key)
      while (strictSteered.size > 200) strictSteered.delete(strictSteered.values().next().value)
      const lines = report.missing.slice(0, 3).map((item) => `- ${item.requirement}${item.why === '' ? '' : `（${item.why}）`}`)
      agent.steer({
        id: randomUUID(),
        role: 'user',
        content: [{ type: 'text', text: `[需求对账] 还有明确需求没有完成：\n${lines.join('\n')}\n请先补齐并给出证据，再结束任务。` }],
        source: { kind: 'user' },
      })
    })
  }, 'reqtrace: strict mode')

  ctx.inject(['connection', 'sessions'], (sctx) => {
    sctx.connection.fetch.register({
      path: '/api/reqtrace.state',
      methods: ['GET'],
      requestBody: 'buffered',
      fetch: async (request) => {
        const sessionId = new URL(request.url).searchParams.get('sessionId') ?? ''
        return Response.json({
          ok: true,
          pending: pendingAudits.has(sessionId),
          turn: pendingAudits.get(sessionId)?.turn ?? null,
        }, { headers: { 'cache-control': 'no-store' } })
      },
    })

    sctx.connection.fetch.register({
      path: '/api/reqtrace.ledger',
      methods: ['GET', 'POST', 'DELETE'],
      requestBody: 'buffered',
      fetch: async (request) => {
        const sessionId = new URL(request.url).searchParams.get('sessionId') ?? ''
        if (request.method === 'GET') {
          const session = sctx.sessions.get(sessionId)
          const ledger = session === undefined ? (taskLedgers.get(sessionId) ?? null) : (currentTaskFor(session) ?? null)
          return Response.json({ ok: true, ledger }, { headers: { 'cache-control': 'no-store' } })
        }
        if (request.method === 'DELETE') {
          const at = new URL(request.url).searchParams.get('at')
          if (at !== null) {
            const ledger = taskLedgers.get(sessionId)
            if (ledger === undefined) return Response.json({ ok: true })
            if (String(ledger.at ?? '') === at) {
              taskLedgers.delete(sessionId)
            } else {
              taskLedgers.set(sessionId, {
                ...ledger,
                history: (ledger.history ?? []).filter((item) => String(item.at ?? '') !== at),
              })
            }
          } else {
            taskLedgers.delete(sessionId)
          }
          pendingAudits.delete(sessionId)
          await persistLedgers()
          return Response.json({ ok: true })
        }
        const body = await request.json().catch(() => ({}))
        const requirements = Array.isArray(body.requirements)
          ? body.requirements.filter((item) => typeof item === 'string' && item.trim() !== '').map((item) => item.trim().slice(0, 160)).slice(0, 8)
          : []
        const previous = taskLedgers.get(sessionId)
        taskLedgers.set(sessionId, {
          requirements,
          turn: previous?.turn ?? currentTurns.get(sessionId) ?? null,
          seq: previous?.seq ?? null,
          at: Date.now(),
          title: previous?.title,
          report: null,
          history: previous?.history ?? [],
        })
        void persistLedgers()
        return Response.json({ ok: true, ledger: taskLedgers.get(sessionId) })
      },
    })

    sctx.connection.fetch.register({
      path: '/api/reqtrace.children',
      methods: ['GET'],
      requestBody: 'buffered',
      fetch: async (request) => {
        const sessionId = new URL(request.url).searchParams.get('sessionId') ?? ''
        const parent = sctx.sessions.get(sessionId)
        if (parent === undefined) return Response.json({ ok: false, code: 'session-not-found' }, { status: 404 })
        const children = childLedgersFor(parent).map((ledger) => ({
          sessionId: ledger.sessionId,
          title: ledger.title,
          requirements: ledger.requirements,
          report: ledger.report ?? null,
          at: ledger.at ?? null,
          parentSessionId: ledger.parentSessionId ?? sessionId,
          delegationDepth: ledger.delegationDepth ?? 0,
        }))
        const known = new Set(children.map((child) => child.sessionId))
        for (const child of ctx.get('sessions')?.list?.() ?? []) {
          if (child?.header?.parentSession !== sessionId || known.has(child.id)) continue
          children.push({
            sessionId: child.id,
            title: child.title,
            requirements: [],
            report: null,
            at: null,
            parentSessionId: sessionId,
            delegationDepth: child.header?.delegationDepth ?? 0,
          })
        }
        return Response.json({ ok: true, children }, { headers: { 'cache-control': 'no-store' } })
      },
    })

    sctx.connection.fetch.register({
      path: '/api/reqtrace.ledgers',
      methods: ['GET', 'DELETE'],
      requestBody: 'buffered',
      fetch: async (request) => {
        if (request.method === 'DELETE') {
          taskLedgers.clear()
          pendingAudits.clear()
          toolCounts.clear()
          strictSteered.clear()
          await persistLedgers()
          return Response.json({ ok: true })
        }
        const requested = Number(new URL(request.url).searchParams.get('limit') ?? 20)
        const limit = Number.isFinite(requested) ? Math.min(200, Math.max(1, Math.round(requested))) : 20
        const ledgers = allLedgers().slice(0, limit)
        return Response.json({ ok: true, ledgers }, { headers: { 'cache-control': 'no-store' } })
      },
    })

    sctx.connection.fetch.register({
      path: '/api/reqtrace.config',
      methods: ['GET', 'POST'],
      requestBody: 'buffered',
      fetch: async (request) => {
        if (request.method === 'GET') {
          return Response.json({ ok: true, config }, { headers: { 'cache-control': 'no-store' } })
        }
        try {
          const body = await request.json().catch(() => ({}))
          config = await writeConfig(ctx, body)
          return Response.json({ ok: true, config })
        } catch (error) {
          return Response.json({ ok: false, code: 'config-failed', message: error?.message ?? String(error) }, { status: 500 })
        }
      },
    })

    sctx.connection.fetch.register({
      path: '/api/reqtrace.audit',
      methods: ['GET'],
      requestBody: 'buffered',
      fetch: async (request) => {
        const url = new URL(request.url)
        const sessionId = url.searchParams.get('sessionId') ?? ''
        const force = url.searchParams.get('refresh') === '1'
        const session = sctx.sessions.get(sessionId)
        if (session === undefined) return Response.json({ ok: false, code: 'session-not-found' }, { status: 404 })
        try {
          const report = await auditSession(ctx, session, request.signal, {
            force,
            requirements: currentTaskFor(session)?.requirements ?? [],
            childLedgers: childLedgersFor(session),
          })
          if (typeof report === 'string') {
            return Response.json({ ok: false, code: 'audit-message', message: report }, { status: 409 })
          }
          pendingAudits.delete(sessionId)
          rememberReport(sessionId, report)
          return Response.json({ ok: true, report }, { headers: { 'cache-control': 'no-store' } })
        } catch (error) {
          return Response.json({ ok: false, code: 'audit-failed', message: error?.message ?? String(error) }, { status: 500 })
        }
      },
    })
  })

  ctx.inject(['commands'], (commandCtx) => {
    commandCtx.commands.register({
      definitionId: 'dsh-reqtrace',
      name: 'reqtrace',
      description: 'Audit a session, resume a historical checklist, or clear saved data',
      input: { hint: '[可选：额外关注点 | audit <session-id> | history | resume <序号> | clear]' },
      handler: async (invocation) => {
        const input = invocation.rawInput.trim()
        if (input === 'history' || input === '历史') {
          return { kind: 'success', text: formatHistory() }
        }
        if (input === 'extract' || input === '提取') {
          const session = invocation.agent?.session
          if (session === undefined) return { kind: 'error', text: '没有找到当前会话。' }
          try {
            const events = readEvents(session)
            const latest = [...events].reverse().find((event) => event?.type === 'user/message' && (event.surfaceOp === undefined || event.surfaceOp === 'append'))
            const text = blocksText(latest?.data?.content)
            if (latest === undefined || !shouldExtract(text)) return { kind: 'error', text: '当前会话还没有可拆解的任务描述。' }
            await runExtraction(session, text, latest.seq)
            const ledger = taskLedgers.get(session.id)
            return { kind: 'success', text: `已从当前任务提取 ${ledger?.requirements?.length ?? 0} 条验收清单。` }
          } catch (error) {
            return { kind: 'error', text: `提取失败：${error?.message ?? error}` }
          }
        }
        if (input === 'fix' || input === '补齐') {
          const session = invocation.agent?.session
          if (session === undefined) return { kind: 'error', text: '没有找到当前会话。' }
          if (typeof invocation.agent?.steer !== 'function') return { kind: 'error', text: '当前会话不能接收补齐指令。' }
          try {
            const report = await auditSession(ctx, session, invocation.signal, {
              requirements: currentTaskFor(session)?.requirements ?? [],
              childLedgers: childLedgersFor(session),
            })
            if (typeof report === 'string') return { kind: 'error', text: report }
            const items = [...(report.missing ?? []), ...(report.partial ?? [])]
            if (items.length === 0) return { kind: 'success', text: '没有需要补齐的明确需求。' }
            const lines = items.slice(0, 5).map((item) => `- ${item.requirement}${item.missing ? `（还缺：${item.missing}）` : item.why ? `（${item.why}）` : ''}`)
            invocation.agent.steer({
              id: randomUUID(),
              role: 'user',
              content: [{ type: 'text', text: `[需求对账] 请按当前任务补齐这些验收项，并给出可核对的证据：\n${lines.join('\n')}\n补齐后再结束任务。` }],
              source: { kind: 'user' },
            })
            rememberReport(session.id, report)
            return { kind: 'success', text: `已把 ${items.length} 条缺失/部分完成的需求发回当前任务。` }
          } catch (error) {
            return { kind: 'error', text: `补齐失败：${error?.message ?? error}` }
          }
        }
        if (input === 'resume' || input === '继续任务') {
          return { kind: 'success', text: formatResumeList() }
        }
        if (input.startsWith('resume ') || input.startsWith('继续任务 ')) {
          const index = Number(input.replace(/^(resume|继续任务)\s+/, '')) - 1
          const ledger = allLedgers().slice(0, 10)[index]
          if (ledger === undefined) return { kind: 'error', text: formatResumeList() }
          if (typeof invocation.agent?.steer !== 'function') return { kind: 'error', text: '当前会话不能接收续接任务。' }
          invocation.agent.steer({
            id: randomUUID(),
            role: 'user',
            content: [{ type: 'text', text: formatResumeMessage(ledger) }],
            source: { kind: 'user' },
          })
          return { kind: 'success', text: `已把历史任务“${ledger.title ?? ledger.sessionId}”的清单带入当前会话。` }
        }
        if (input.startsWith('audit ') || input.startsWith('审计 ')) {
          const targetId = input.replace(/^(audit|审计)\s+/, '').trim()
          const target = ctx.get('sessions')?.get?.(targetId)
          if (target === undefined) return { kind: 'error', text: `找不到会话：${targetId}` }
          const report = await auditSession(ctx, target, invocation.signal, {
            requirements: taskLedgers.get(targetId)?.requirements ?? [],
            childLedgers: childLedgersFor(target),
          })
          if (typeof report === 'string') return { kind: 'error', text: report }
          rememberReport(targetId, report)
          return { kind: 'success', text: formatReport(report) }
        }
        if (input === 'clear all' || input === '清除全部') {
          taskLedgers.clear()
          pendingAudits.clear()
          toolCounts.clear()
          strictSteered.clear()
          await persistLedgers()
          return { kind: 'success', text: '已清空全部历史清单。' }
        }
        const session = invocation.agent?.session
        if (session === undefined) return { kind: 'error', text: '没有找到当前会话。' }
        if (input === 'clear' || input === '清除') {
          taskLedgers.delete(session.id)
          pendingAudits.delete(session.id)
          await persistLedgers()
          return { kind: 'success', text: '已清除当前会话清单。' }
        }
        try {
          const report = await auditSession(ctx, session, invocation.signal, {
            requirements: currentTaskFor(session)?.requirements ?? [],
            childLedgers: childLedgersFor(session),
          })
          if (typeof report === 'string') return { kind: 'error', text: report }
          pendingAudits.delete(session.id)
          rememberReport(session.id, report)
          return { kind: 'success', text: formatReport(report) }
        } catch (error) {
          const message = error?.message === 'no-model'
            ? '当前 profile 没有可用模型。'
            : `需求对账失败：${error?.message ?? error}`
          return { kind: 'error', text: message }
        }
      },
    })
  })
}
