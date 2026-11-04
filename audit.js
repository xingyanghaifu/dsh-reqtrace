const MAX_EVIDENCE_CHARS = 20000
const MAX_MESSAGE_CHARS = 4000

const CONTINUATION = /^(继续|可以|好的|好|行|嗯|对|没问题|ok|okay|go on|continue|sure|yes)[\s。.!！?？]*$/i

/** Short replies and acknowledgements should not overwrite the task checklist. */
export function shouldExtract(text) {
  const value = String(text ?? '').trim()
  return value.length >= 8 && !value.startsWith('/') && !CONTINUATION.test(value)
}

export function blocksText(blocks) {
  if (typeof blocks === 'string') return blocks.trim()
  if (!Array.isArray(blocks)) return ''
  const parts = []
  for (const block of blocks) {
    if (block === null || typeof block !== 'object') continue
    if (block.kind !== 'text' && block.type !== 'text') continue
    if (typeof block.text === 'string' && block.text.trim() !== '') parts.push(block.text.trim())
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function truncate(value, limit) {
  const text = String(value ?? '')
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text
}

function normalizeFingerprint(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, 500)
}

function toolTarget(name, args) {
  if (args === null || typeof args !== 'object') return ''
  for (const key of ['file_path', 'path', 'command', 'cmd', 'url', 'pattern']) {
    if (typeof args[key] === 'string' && args[key].trim() !== '') return `${key}=${args[key].trim()}`
  }
  return ''
}

/**
 * Read the raw session log. Prefer the projection-aware snapshot; fall back to
 * the live event array when a test or a headless session has no snapshot.
 */
export function readEvents(session) {
  try {
    if (typeof session?.snapshotEvents === 'function') return session.snapshotEvents()
  } catch { /* fall through */ }
  try {
    if (Number.isInteger(session?.seq) && typeof session.eventAt === 'function') {
      const events = []
      for (let i = 0; i < session.seq; i += 1) {
        try {
          const event = session.eventAt(i)
          if (event !== undefined) events.push(event)
        } catch { /* skip broken tail */ }
      }
      return events
    }
  } catch { /* fall through */ }
  return Array.isArray(session?.events) ? session.events : []
}

/**
 * Split a session log into user requests, tool evidence and the final answer.
 * Pure data only; no model call.
 */
export function collectEvidence(events) {
  const requests = []
  const finalAnswers = []
  const calls = new Map()
  const evidence = []

  for (const event of events ?? []) {
    if (event === null || typeof event !== 'object') continue
    if (event.type === 'user/message') {
      const text = blocksText(event.data?.content)
      if (text !== '') requests.push(truncate(text, MAX_MESSAGE_CHARS))
      continue
    }
    if (event.type === 'assistant/message') {
      const text = blocksText(event.data?.message?.content)
      if (text !== '') finalAnswers.push(truncate(text, MAX_MESSAGE_CHARS))
      continue
    }
    if (event.type === 'tool/call') {
      const args = (() => {
        try {
          return JSON.parse(event.data?.arguments ?? '{}')
        } catch {
          return {}
        }
      })()
      calls.set(String(event.data?.callId ?? ''), { name: event.data?.name, args })
      evidence.push({
        kind: 'call',
        callId: event.data?.callId,
        name: event.data?.name,
        target: toolTarget(event.data?.name, args),
        fingerprint: typeof args.content === 'string'
          ? normalizeFingerprint(args.content)
          : (typeof args.old_string === 'string' || typeof args.new_string === 'string'
            ? normalizeFingerprint(`${args.old_string ?? ''}\u0001${args.new_string ?? ''}`)
            : ''),
      })
      continue
    }
    if (event.type === 'tool/result') {
      const callId = String(event.data?.message?.toolCallId ?? '')
      const call = calls.get(callId)
      const text = blocksText(event.data?.message?.content)
      const error = event.data?.error
      evidence.push({
        kind: 'result',
        callId,
        name: call?.name ?? '',
        ok: error === undefined && event.data?.message?.isError !== true,
        detail: truncate(error?.message ?? text, 400),
      })
    }
  }

  return {
    requests: requests.slice(-8),
    evidence,
    finalAnswer: finalAnswers.at(-1) ?? '',
  }
}

function evidenceEntries(collected) {
  const entries = []
  for (const item of collected.evidence) {
    if (item.kind !== 'call') continue
    const match = /(?:file_path|path)=([^\s]+)/.exec(item.target)
    if (match !== null) entries.push({ path: match[1], fingerprint: item.fingerprint ?? '' })
  }
  return entries
}

export function findConflicts(parent, children, childLedgers = []) {
  const owners = new Map()
  const fingerprints = new Map()
  const note = (path, owner, fingerprint) => {
    const list = owners.get(path) ?? []
    if (!list.some((item) => item.id === owner.id)) list.push(owner)
    owners.set(path, list)
    if (fingerprint !== '') {
      const variants = fingerprints.get(path) ?? new Set()
      variants.add(fingerprint)
      fingerprints.set(path, variants)
    }
  }
  for (const entry of evidenceEntries(parent)) note(entry.path, { id: null, label: '当前任务' }, entry.fingerprint)
  for (const child of children) {
    for (const entry of evidenceEntries(child)) note(entry.path, { id: child.sessionId, label: child.title ?? child.sessionId }, entry.fingerprint)
  }
  const conflicts = [...owners.entries()]
    .filter(([, list]) => list.length > 1)
    .map(([path, list]) => ({
      text: `${path}：${list.map((item) => item.label).join(' / ')}${(fingerprints.get(path)?.size ?? 0) > 1 ? '（内容版本不一致）' : ''}`,
      sessions: list.map((item) => item.id).filter((id) => id !== null),
    }))

  const requirementOwners = new Map()
  for (const child of childLedgers) {
    for (const requirement of child.requirements ?? []) {
      const key = String(requirement).trim()
      if (key === '') continue
      const list = requirementOwners.get(key) ?? []
      if (!list.some((item) => item.id === child.sessionId)) list.push({ id: child.sessionId, label: child.title ?? child.sessionId })
      requirementOwners.set(key, list)
    }
  }
  for (const [requirement, list] of requirementOwners) {
    if (list.length > 1) {
      conflicts.push({
        text: `需求重复：${requirement} — ${list.map((item) => item.label).join(' / ')}`,
        sessions: list.map((item) => item.id),
      })
    }
  }
  return conflicts
}

function statusForRequirement(report, text) {
  if (report === null || typeof report !== 'object') return '待核对'
  for (const [status, items] of [['已完成', report.done ?? []], ['部分完成', report.partial ?? []], ['缺失', report.missing ?? []]]) {
    if (items.some((item) => item.requirement === text)) return status
  }
  return '待核对'
}

/** Build the bounded, model-facing audit prompt from collected evidence. */
export function buildAuditPrompt(collected, requirements = [], childCollected = [], childLedgers = [], conflicts = []) {
  const checklistText = requirements.length === 0
    ? ''
    : `CHECKLIST (use these items as the source of truth, in this order):\n${requirements.map((text, index) => `${index + 1}. ${text}`).join('\n')}\n\n`
  // Scope to the latest request when no checklist was extracted; older user
  // messages in the same session belong to previous tasks and only add noise.
  const requestText = collected.requests.length === 0
    ? '(no user message found)'
    : `[current request]\n${collected.requests.at(-1)}`
  const evidenceText = collected.evidence.length === 0
    ? '(no tool evidence found)'
    : collected.evidence.map((item) => item.kind === 'call'
      ? `- CALL ${item.name}${item.target === '' ? '' : ` (${item.target})`}`
      : `- RESULT ${item.name}: ${item.ok ? 'ok' : 'error'}${item.detail === '' ? '' : ` — ${item.detail}`}`).join('\n')
  const finalText = collected.finalAnswer === '' ? '(no final answer found)' : collected.finalAnswer
  const childText = childCollected.length === 0
    ? ''
    : `\n\nSUBAGENT EVIDENCE:\n${childCollected.map((child) => {
      const calls = child.evidence.filter((item) => item.kind === 'call').map((item) => `CALL ${item.name}${item.target === '' ? '' : ` (${item.target})`}`)
      const results = child.evidence.filter((item) => item.kind === 'result').map((item) => `RESULT ${item.name}: ${item.ok ? 'ok' : 'error'}`)
      return [`- ${child.title ?? child.sessionId}`, ...calls, ...results, child.finalAnswer === '' ? '' : `FINAL: ${child.finalAnswer}`].filter(Boolean).join('\n  ')
    }).join('\n')}`
  const childChecklistText = childLedgers.length === 0
    ? ''
    : `\n\nCHILD CHECKLISTS:\n${childLedgers.map((child) => [
      `- ${child.title ?? child.sessionId}`,
      ...(child.requirements ?? []).map((text) => `  [${statusForRequirement(child.report, text)}] ${text}`),
    ].join('\n')).join('\n')}`
  const conflictText = conflicts.length === 0
    ? ''
    : `\n\nPOTENTIAL CONFLICTS:\n${conflicts.map((conflict) => `- ${typeof conflict === 'string' ? conflict : conflict.text}`).join('\n')}`

  return [
    checklistText,
    'USER REQUEST(S):',
    requestText,
    '',
    'TOOL EVIDENCE:',
    evidenceText,
    '',
    'FINAL ANSWER:',
    finalText,
    childChecklistText,
    childText,
    conflictText,
  ].join('\n').slice(0, MAX_EVIDENCE_CHARS)
}

const SYSTEM = `You are a requirement auditor for an AI coding agent. Given the user's request(s), the agent's tool calls/results, and the final answer, return ONE JSON object only.

Rules:
1. Extract only explicit requirements and clearly implied constraints from the user's words. Do not invent requirements.
2. Find concrete evidence in tool calls/results, file paths, commands or test output. A claim in the final answer without tool evidence is not proof.
3. If a CHECKLIST is present, use its items as the source of truth and keep that order; do not add other requirements.
4. Put each requirement in exactly one bucket: done, partial, missing, extra.
5. "done" and "partial" items need short evidence (max 120 chars). "missing" needs a short reason.
6. Keep every string short; this is for a human to scan, not a full report.
7. Add up to 3 "next" actions telling the human what to check or fix first, highest priority first.
8. Answer in the same language as the user's request.

Examples:
- Request: "Add CSV export"; evidence: write export.ts and test export.test.ts.
  Result: {"verdict":"1 done, 0 partial, 0 missing, 0 extra","next":[],"missing":[],"partial":[],"done":[{"requirement":"Add CSV export","evidence":"export.ts + export.test.ts"}],"extra":[]}
- Request: "Fix the bug and add tests"; evidence: edit bug.ts only.
  Result: {"verdict":"0 done, 1 partial, 1 missing, 0 extra","next":[{"action":"Add tests","why":"no test file or test command was found"}],"missing":[{"requirement":"Add tests","why":"no test evidence"}],"partial":[{"requirement":"Fix the bug","missing":"change exists but no verification"}],"done":[],"extra":[]}

Return ONLY JSON, no markdown fences:
{"verdict":"1 done, 1 partial, 1 missing, 0 extra","next":[{"action":"...","why":"..."}],"missing":[{"requirement":"...","why":"..."}],"partial":[{"requirement":"...","missing":"..."}],"done":[{"requirement":"...","evidence":"..."}],"extra":["..."]}`

function stringList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.trim() !== '').map((item) => item.trim()) : []
}

function objectList(value, fields) {
  if (!Array.isArray(value)) return []
  return value
    .filter((item) => item !== null && typeof item === 'object' && !Array.isArray(item))
    .map((item) => Object.fromEntries(fields.map((field) => [field, typeof item[field] === 'string' ? item[field].trim() : ''])))
    .filter((item) => item[fields[0]] !== '')
}

/** Repair the common "unescaped quote inside a Chinese value" model mistake. */
function repairUnescapedQuotes(text) {
  let out = ''
  let inString = false
  let escaped = false
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (escaped) {
      out += char
      escaped = false
      continue
    }
    if (char === '\\') {
      out += char
      escaped = true
      continue
    }
    if (char !== '"') {
      out += char
      continue
    }
    if (!inString) {
      inString = true
      out += char
      continue
    }
    let next = index + 1
    while (next < text.length && /\s/.test(text[next])) next += 1
    const following = text[next]
    if (following === undefined || following === ',' || following === '}' || following === ']' || following === ':') {
      inString = false
      out += char
    } else {
      out += '\\"'
    }
  }
  return out
}

function parseJsonObject(text) {
  try {
    return JSON.parse(text)
  } catch {
    return JSON.parse(repairUnescapedQuotes(text))
  }
}

/** Normalize one model answer into the compact shape the UI renders. */
export function parseReport(text) {
  const raw = String(text ?? '').trim()
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim()
  try {
    const data = parseJsonObject(cleaned)
    if (data === null || typeof data !== 'object' || Array.isArray(data)) throw new Error('not-object')
    return {
      verdict: typeof data.verdict === 'string' ? data.verdict.trim() : '',
      next: objectList(data.next, ['action', 'why']),
      missing: objectList(data.missing, ['requirement', 'why']),
      partial: objectList(data.partial, ['requirement', 'missing']),
      done: objectList(data.done, ['requirement', 'evidence']),
      extra: stringList(data.extra),
    }
  } catch {
    return { verdict: '', next: [], missing: [], partial: [], done: [], extra: [], raw }
  }
}

/** Plain-text form for the `/reqtrace` command (the sidebar renders the object). */
export function formatReport(report) {
  const lines = []
  if (report.verdict !== '') lines.push(`需求对账：${report.verdict}`)
  if (report.next.length > 0) {
    lines.push('', '先看这几条：')
    for (const item of report.next) lines.push(`→ ${item.action}${item.why === '' ? '' : ` — ${item.why}`}`)
  }
  if (report.missing.length > 0) {
    lines.push('', '需要你处理：')
    for (const item of report.missing) lines.push(`❌ ${item.requirement}${item.why === '' ? '' : ` — ${item.why}`}`)
  }
  if (report.partial.length > 0) {
    lines.push('', '部分完成：')
    for (const item of report.partial) lines.push(`⚠️ ${item.requirement}${item.missing === '' ? '' : ` — ${item.missing}`}`)
  }
  if (report.done.length > 0) {
    lines.push('', '已完成：')
    for (const item of report.done) lines.push(`✅ ${item.requirement}${item.evidence === '' ? '' : ` — ${item.evidence}`}`)
  }
  if (report.extra.length > 0) {
    lines.push('', '超出范围：')
    for (const item of report.extra) lines.push(`➕ ${item}`)
  }
  if (Array.isArray(report.conflicts) && report.conflicts.length > 0) {
    lines.push('', '潜在冲突：')
    for (const item of report.conflicts) lines.push(`⚠️ ${typeof item === 'string' ? item : item.text}`)
  }
  if (report.raw !== undefined) lines.push('', report.raw)
  if (report.usage !== undefined && report.usage !== null) {
    lines.push('', `Token：输入 ${report.usage.inputTokens ?? '?'} / 输出 ${report.usage.outputTokens ?? '?'}`)
  }
  return lines.join('\n').trim()
}

/** Reports are keyed by session + committed event sequence, so a re-open is free. */
const auditCache = new Map()

function auditKey(session, requirements = [], turn = undefined, childScope = '') {
  const scope = turn === undefined || turn === null ? String(session.seq ?? '') : `turn:${turn}`
  return `${session.id}:${scope}:${childScope}:${requirements.join('\u0001')}`
}

function rememberAudit(key, report) {
  auditCache.set(key, report)
  while (auditCache.size > 16) auditCache.delete(auditCache.keys().next().value)
}

const EXTRACT_SYSTEM = `Extract the user's concrete requirements from the message. Return ONLY JSON, no markdown fences:
{"requirements":["one short requirement","another"]}

Rules:
1. Use only explicit asks and clearly implied constraints; do not invent requirements.
2. Max 8 items; each item short (<= 120 chars).
3. If the message contains no concrete requirement, return {"requirements":[]}.
4. Answer in the same language as the message.`

/**
 * Extract a first-pass checklist from one user message. This is intentionally
 * separate from the audit: it runs when a task starts, before any evidence exists.
 * @returns `{ requirements, usage }`; usage is the provider token usage when reported.
 */
export async function extractRequirements(ctx, text, signal) {
  const source = String(text ?? '').trim()
  if (source === '') return { requirements: [], usage: null }
  const selected = ctx.get('agentDefaultModel')?.currentSelection()
  if (selected === undefined || selected === null) return { requirements: [], usage: null }
  const llm = ctx.get('llm')
  if (llm === undefined) return { requirements: [], usage: null }

  const call = await llm.prepareCall({ provider: selected.provider, model: selected.model, maxTokens: 500 }, signal)
  const messages = [{ role: 'user', content: [{ type: 'text', text: source.slice(0, 4000) }] }]
  let raw = ''
  let usage = null
  for await (const chunk of call.stream({ ...call.config, messages, system: EXTRACT_SYSTEM, signal })) {
    if (chunk.type === 'text-delta') raw += chunk.text
    if (chunk.type === 'usage') usage = chunk.usage
  }
  try {
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim()
    const data = JSON.parse(cleaned)
    const requirements = Array.isArray(data?.requirements)
      ? data.requirements.filter((item) => typeof item === 'string' && item.trim() !== '').map((item) => item.trim().slice(0, 160)).slice(0, 8)
      : []
    return { requirements, usage }
  } catch {
    return { requirements: [], usage }
  }
}

/** Collect live and archived descendant sessions for a parent session. */
async function childSessionsFor(ctx, session) {
  const children = new Map()
  const liveSessions = ctx.get('sessions')?.list?.() ?? []
  const query = ctx.get('sessionQuery')

  const visit = async (parentId, depth) => {
    if (depth > 3 || children.size >= 20) return
    const direct = []
    const add = (id, title, events) => {
      if (typeof id !== 'string' || id === parentId || children.has(id)) return
      children.set(id, { id, title, events, depth })
      direct.push(children.get(id))
    }

    for (const child of liveSessions) {
      if (child?.header?.origin === 'subagent' && child?.header?.parentSession === parentId) {
        add(child.id, child.title, readEvents(child))
      }
    }

    if (typeof query?.filterSessions === 'function') {
      try {
        const matches = await query.filterSessions([{ kind: 'parent', values: [parentId] }])
        for (const match of matches ?? []) {
          const header = match?.header ?? match?.session
          const id = header?.id ?? match?.sessionId
          if (typeof id !== 'string' || children.has(id)) continue
          try {
            const loaded = await query.readSession(id)
            let title = header?.title ?? match?.title
            if ((title === undefined || title === '') && typeof query.readTitle === 'function') {
              try {
                title = await query.readTitle(id)
              } catch {
                // Title is optional.
              }
            }
            add(id, title, loaded?.events ?? [])
          } catch {
            // A missing archived child should not fail the parent audit.
          }
        }
      } catch {
        // Session query is optional; the live children above still work.
      }
    }

    for (const child of direct) await visit(child.id, depth + 1)
  }

  await visit(session.id, 0)
  return [...children.values()]
}

/**
 * Run one requirement audit through the configured model.
 * @returns Structured audit report, or a string error message.
 */
export async function auditSession(ctx, session, signal, options = {}) {
  const requirements = Array.isArray(options.requirements)
    ? options.requirements.filter((item) => typeof item === 'string' && item.trim() !== '').map((item) => item.trim())
    : []
  const childSessions = await childSessionsFor(ctx, session)
  const childCollected = childSessions.map((child) => ({
    sessionId: child.id,
    title: child.title,
    ...collectEvidence(child.events),
  }))
  const childLedgers = Array.isArray(options.childLedgers) ? options.childLedgers : []
  const childScope = [
    ...childSessions.map((child) => `${child.id}:${String(child.seq ?? '')}`),
    ...childLedgers.map((child) => `${child.sessionId}:${String(child.at ?? '')}:${(child.requirements ?? []).join('\u0001')}`),
  ].join(',')
  const key = auditKey(session, requirements, options.turn, childScope)
  if (!options.force && auditCache.has(key)) return auditCache.get(key)

  const collected = collectEvidence(readEvents(session))
  if (collected.requests.length === 0) return '没有找到用户需求，无法对账。'
  const selected = ctx.get('agentDefaultModel')?.currentSelection()
  if (selected === undefined || selected === null) return '当前 profile 没有可用模型，无法生成需求对账单。'
  // Never read ctx.llm directly: Cordis throws when the service was not
  // declared in `inject`. `get()` is the optional lookup we want here.
  const llm = ctx.get('llm')
  if (llm === undefined) return '当前 profile 没有 LLM 服务，无法生成需求对账单。'

  const call = await llm.prepareCall({
    provider: selected.provider,
    model: selected.model,
    maxTokens: 1200,
  }, signal)
  const conflicts = findConflicts(collected, childCollected, childLedgers)
  const messages = [{ role: 'user', content: [{ type: 'text', text: buildAuditPrompt(collected, requirements, childCollected, childLedgers, conflicts) }] }]
  let text = ''
  let usage = null
  for await (const chunk of call.stream({ ...call.config, messages, system: SYSTEM, signal })) {
    if (chunk.type === 'text-delta') text += chunk.text
    if (chunk.type === 'usage') usage = chunk.usage
  }
  const report = parseReport(text)
  if (usage !== null) report.usage = usage
  if (conflicts.length > 0) report.conflicts = conflicts
  rememberAudit(key, report)
  return report
}
