window.__ModuleLoader__.load({
  id: 'dsh-reqtrace',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'reqtrace'

    const zh = {
      'panel.title': '需求对账',
      'panel.description': '逐条核对当前会话的需求、工具证据和最终答复。',
      'panel.run': '重跑',
      'panel.running': '对账中…',
      'panel.empty': '还没有对账结果。',
      'panel.failed': '对账失败',
      'panel.missing': '需要你处理',
      'panel.partial': '部分完成',
      'panel.done': '已完成',
      'panel.extra': '超出范围',
      'panel.conflicts': '潜在冲突',
      'panel.openSession': '打开',
      'panel.next': '先看这几条',
      'panel.summary': '结论',
      'panel.noUsage': '模型未返回 token 用量',
      'panel.pendingTitle': '有新的任务待检查',
      'panel.ledger': '本次任务清单',
      'panel.ignore': '忽略',
      'panel.copy': '复制',
      'panel.copied': '已复制',
      'panel.export': '导出',
      'panel.exported': '已导出',
      'panel.edit': '编辑',
      'panel.cancel': '取消',
      'panel.add': '+ 添加',
      'panel.saveLedger': '保存清单',
      'panel.ledgerEmpty': '还没有清单，点“编辑”手动添加。',
      'panel.history': '历史任务',
      'panel.children': '子任务',
      'panel.resume': '继续',
      'panel.resumeSent': '已发送续接指令',
      'panel.resumeFailed': '续接失败',
      'panel.open': '需求对账',
      'panel.noSession': '没有找到当前会话。',
      'settings.title': '需求对账',
      'settings.description': '任务结束时提醒你检查需求是否真的完成。',
      'settings.autoAudit': '结束自动审计',
      'settings.autoAuditHint': '开启后，任务结束会自动跑一次模型审计；会消耗 token。',
      'settings.autoExtract': '任务开始时提取验收清单',
      'settings.autoExtractHint': '开启后，用户消息一到就先拆出 3–8 条验收项；也会消耗 token。',
      'settings.strict': '严格模式',
      'settings.strictHint': '有明确需求缺失时，提醒 Agent 继续补齐，不直接结束。',
      'settings.costHint': '成本参考：每次提取最多约 4k 输入 / 500 输出，每次审计最多约 20k 输入 / 1.2k 输出；实际以模型返回的 usage 为准。',
      'settings.minToolCalls': '至少工具调用次数',
      'settings.minToolCallsHint': '低于这个次数的短任务不提醒。',
      'settings.save': '保存',
      'settings.saving': '保存中…',
      'settings.saved': '已保存',
      'settings.failed': '保存失败',
      'settings.history': '最近任务清单',
      'settings.historyEmpty': '还没有历史清单。',
      'settings.clearHistory': '清除全部历史清单',
      'settings.confirmClear': '确认清除全部',
      'settings.clearDone': '历史清单已清除',
      'settings.clearOne': '清除',
      'settings.confirmClearOne': '确认',
    }
    const en = {
      'panel.title': 'Requirement Trace',
      'panel.description': 'Check each requirement against the session’s tool evidence and final answer.',
      'panel.run': 'Run',
      'panel.running': 'Auditing…',
      'panel.empty': 'No audit result yet.',
      'panel.failed': 'Audit failed',
      'panel.missing': 'Needs your attention',
      'panel.partial': 'Partially done',
      'panel.done': 'Done',
      'panel.extra': 'Out of scope',
      'panel.conflicts': 'Potential conflicts',
      'panel.openSession': 'Open',
      'panel.next': 'Check these first',
      'panel.summary': 'Verdict',
      'panel.noUsage': 'Model did not report token usage',
      'panel.pendingTitle': 'A new task is ready for audit',
      'panel.ledger': 'Task checklist',
      'panel.ignore': 'Ignore',
      'panel.copy': 'Copy',
      'panel.copied': 'Copied',
      'panel.export': 'Export',
      'panel.exported': 'Exported',
      'panel.edit': 'Edit',
      'panel.cancel': 'Cancel',
      'panel.add': '+ Add',
      'panel.saveLedger': 'Save checklist',
      'panel.ledgerEmpty': 'No checklist yet. Click Edit to add one.',
      'panel.history': 'Task history',
      'panel.children': 'Subagent tasks',
      'panel.resume': 'Continue',
      'panel.resumeSent': 'Continuation sent',
      'panel.resumeFailed': 'Continue failed',
      'panel.open': 'Requirement Trace',
      'panel.noSession': 'No current session.',
      'settings.title': 'Requirement Trace',
      'settings.description': 'Remind you to check whether a task really met its requirements.',
      'settings.autoAudit': 'Auto-audit on turn end',
      'settings.autoAuditHint': 'When on, a model audit runs automatically after a task; this costs tokens.',
      'settings.autoExtract': 'Extract a checklist at task start',
      'settings.autoExtractHint': 'When on, the user message is turned into 3–8 checklist items first; this also costs tokens.',
      'settings.strict': 'Strict mode',
      'settings.strictHint': 'When a clear requirement is missing, keep the agent working instead of ending.',
      'settings.costHint': 'Cost guide: extraction up to ~4k input / 500 output, audit up to ~20k input / 1.2k output; provider usage is authoritative.',
      'settings.minToolCalls': 'Minimum tool calls',
      'settings.minToolCallsHint': 'Short tasks below this count do not trigger a reminder.',
      'settings.save': 'Save',
      'settings.saving': 'Saving…',
      'settings.saved': 'Saved',
      'settings.failed': 'Save failed',
      'settings.history': 'Recent task checklists',
      'settings.historyEmpty': 'No saved checklists yet.',
      'settings.clearHistory': 'Clear all history',
      'settings.confirmClear': 'Confirm clear all',
      'settings.clearDone': 'History cleared',
      'settings.clearOne': 'Clear',
      'settings.confirmClearOne': 'Confirm',
    }

    const card = {
      border: '.5px solid var(--dsw-alias-border-l2)',
      borderRadius: '12px',
      background: 'var(--dsw-alias-bg-layer-1)',
      color: 'var(--dsw-alias-label-primary)',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxSizing: 'border-box',
      height: '100%',
      minHeight: 0,
    }
    const header = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      flexWrap: 'wrap',
    }
    const button = {
      border: '.5px solid var(--dsw-alias-border-l2)',
      borderRadius: '8px',
      background: 'var(--dsw-alias-bg-layer-1)',
      color: 'var(--dsw-alias-label-primary)',
      padding: '4px 10px',
      fontSize: '12px',
      lineHeight: '18px',
      cursor: 'pointer',
    }
    const reportStyle = {
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
      fontFamily: 'var(--ds-font-family-code)',
      fontSize: '12px',
      lineHeight: '1.55',
      margin: 0,
      padding: '10px 12px',
      borderRadius: '9px',
      background: 'var(--dsw-alias-bg-layer-2)',
      color: 'var(--dsw-alias-label-secondary)',
      overflow: 'auto',
      flex: '1',
      minHeight: 0,
    }

    async function api(path, options = {}) {
      const response = await fetch(path, options)
      const data = await response.json().catch(() => ({}))
      if (!response.ok || data.ok === false) {
        const detail = data.message ?? data.code ?? `HTTP ${response.status}`
        throw new Error(detail)
      }
      return data
    }

    const normalizeRequirement = (value) => String(value ?? '').replace(/\s+/g, '').toLowerCase()

    function requirementStatus(report, text) {
      if (report === null || report === undefined || typeof report === 'string') return ''
      const wanted = normalizeRequirement(text)
      if (wanted === '') return ''
      const buckets = [['done', report.done ?? []], ['partial', report.partial ?? []], ['missing', report.missing ?? []]]
      for (const [status, items] of buckets) {
        for (const item of items) {
          const candidate = normalizeRequirement(item.requirement)
          if (candidate === wanted || (candidate.length > 4 && wanted.length > 4 && (candidate.includes(wanted) || wanted.includes(candidate)))) return status
        }
      }
      return ''
    }

    function statusMark(status) {
      if (status === 'done') return { text: '✓', color: 'var(--dsw-alias-state-success-primary)' }
      if (status === 'partial') return { text: '!', color: 'var(--dsw-alias-state-warn-primary)' }
      if (status === 'missing') return { text: '×', color: 'var(--dsw-alias-state-error-primary)' }
      return { text: '·', color: 'var(--dsw-alias-label-tertiary)' }
    }

    function formatTime(value) {
      if (typeof value !== 'number' || value <= 0) return ''
      try {
        return new Date(value).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      } catch {
        return ''
      }
    }

    function formatUsage(usage) {
      if (usage === null || usage === undefined) return ''
      const input = Number(usage.inputTokens)
      const output = Number(usage.outputTokens)
      if (!Number.isFinite(input) && !Number.isFinite(output)) return ''
      return `输入 ${Number.isFinite(input) ? input : '?'} / 输出 ${Number.isFinite(output) ? output : '?'} tokens`
    }

    function Icon({ size = 18 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
      },
      h('rect', { x: 4, y: 3, width: 16, height: 18, rx: 3 }),
      h('path', { d: 'M8 8h8M8 12h8M8 16h5' }),
      h('path', { d: 'M15.5 16l2 2 3-3' }))
    }

    function ReportSection({ t, title, color, items, render, onIgnore, onOpen }) {
      if (items.length === 0) return null
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '5px' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
          h('span', { style: { width: '7px', height: '7px', borderRadius: '50%', background: color, flex: 'none' } }),
          h('strong', { style: { fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-primary)' } }, `${title} (${items.length})`),
        ),
        ...items.map((item, index) => {
          const view = render(item)
          const hasTools = Array.isArray(item.tools) && item.tools.length > 0
          const hasFiles = Array.isArray(item.files) && item.files.length > 0
          return h('div', {
            key: `${title}-${index}`,
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '8px 10px',
              borderRadius: '8px',
              background: 'var(--dsw-alias-bg-layer-2)',
              minWidth: 0,
            },
          },
          h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' } },
            h('span', { style: { flex: 1, fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-primary)', overflowWrap: 'anywhere' } }, view.title),
            onIgnore === undefined ? null : h('button', {
              type: 'button',
              style: { ...button, flex: 'none', padding: '1px 5px', fontSize: '10px', lineHeight: '15px' },
              onClick: () => onIgnore(view.title),
            }, t('panel.ignore')),
            onOpen === undefined || item?.sessions?.length === undefined || item.sessions.length === 0 ? null : h('button', {
              type: 'button',
              style: { ...button, flex: 'none', padding: '1px 5px', fontSize: '10px', lineHeight: '15px' },
              onClick: () => onOpen(item),
            }, t('panel.openSession')),
          ),
          view.detail === '' ? null : h('div', { style: { fontSize: '11px', lineHeight: '17px', color: 'var(--dsw-alias-label-tertiary)', overflowWrap: 'anywhere' } }, view.detail),
          hasTools ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' } },
            h('span', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-quaternary)' } }, '🔧'),
            ...item.tools.slice(0, 8).map((tool, ti) => 
              h('span', {
                key: `tool-${ti}`,
                style: {
                  fontSize: '10px',
                  lineHeight: '15px',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  background: 'var(--dsw-alias-bg-layer-3)',
                  color: 'var(--dsw-alias-label-tertiary)',
                  fontFamily: 'var(--ds-font-family-code)',
                },
              }, tool)
            ),
            item.tools.length > 8 ? h('span', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-quaternary)' } }, `+${item.tools.length - 8}`) : null,
          ) : null,
          hasFiles ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
            ...item.files.slice(0, 5).map((file, fi) => 
              h('div', {
                key: `file-${fi}`,
                style: {
                  fontSize: '10px',
                  lineHeight: '16px',
                  color: 'var(--dsw-alias-label-tertiary)',
                  fontFamily: 'var(--ds-font-family-code)',
                  paddingLeft: '14px',
                  overflowWrap: 'anywhere',
                },
              }, `📄 ${file}`)
            ),
            item.files.length > 5 ? h('div', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-quaternary)', paddingLeft: '14px' } }, `... 还有 ${item.files.length - 5} 个文件`) : null,
          ) : null,
          )
        }),
      )
    }

    function ReportView({ t, report, openSession }) {
      const [ignored, setIgnored] = React.useState(() => new Set())
      const ignore = (value) => setIgnored((current) => {
        const next = new Set(current)
        next.add(value)
        return next
      })
      if (report === null || report === undefined) {
        return h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px' } }, t('panel.empty'))
      }
      if (typeof report === 'string') {
        return h('pre', { style: reportStyle }, report)
      }
      if (typeof report.raw === 'string' && report.raw !== '') {
        return h('pre', { style: reportStyle }, report.raw)
      }
      const missing = (report.missing ?? []).filter((item) => !ignored.has(item.requirement))
      const partial = (report.partial ?? []).filter((item) => !ignored.has(item.requirement))
      const done = report.done ?? []
      const total = missing.length + partial.length + done.length
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'auto', flex: 1, minHeight: 0 } },
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '7px 9px',
            borderRadius: '9px',
            background: 'var(--dsw-alias-bg-layer-2)',
          },
        },
        h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)' } }, t('panel.summary')),
        h('strong', { style: { fontSize: '13px', color: 'var(--dsw-alias-label-primary)' } }, report.verdict || `${total} requirements checked`),
        h('span', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-tertiary)' } }, formatUsage(report.usage) === '' ? t('panel.noUsage') : formatUsage(report.usage)),
        ),
        h(ReportSection, {
          t,
          title: t('panel.next'),
          color: 'var(--dsw-alias-state-business-primary)',
          items: report.next ?? [],
          render: (item) => ({ title: item.action, detail: item.why }),
        }),
        h(ReportSection, {
          t,
          title: t('panel.missing'),
          color: 'var(--dsw-alias-state-error-primary)',
          items: missing,
          render: (item) => ({ title: item.requirement, detail: item.why }),
          onIgnore: ignore,
        }),
        h(ReportSection, {
          t,
          title: t('panel.partial'),
          color: 'var(--dsw-alias-state-warn-primary)',
          items: partial,
          render: (item) => ({ title: item.requirement, detail: item.missing }),
          onIgnore: ignore,
        }),
        h(ReportSection, {
          t,
          title: t('panel.done'),
          color: 'var(--dsw-alias-state-success-primary)',
          items: done,
          render: (item) => ({ title: item.requirement, detail: item.evidence }),
        }),
        h(ReportSection, {
          t,
          title: t('panel.extra'),
          color: 'var(--dsw-alias-label-tertiary)',
          items: report.extra ?? [],
          render: (item) => ({ title: item, detail: '' }),
        }),
        h(ReportSection, {
          t,
          title: t('panel.conflicts'),
          color: 'var(--dsw-alias-state-warn-primary)',
          items: report.conflicts ?? [],
          render: (item) => ({ title: typeof item === 'string' ? item : item.text, detail: '' }),
          onOpen: openSession,
        }),
        total === 0 && (report.extra?.length ?? 0) === 0 ? h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px' } }, t('panel.empty')) : null,
      )
    }

    function AuditPanel({ sessionId, t, resume, openSession }) {
      const [report, setReport] = React.useState(null)
      const [ledger, setLedger] = React.useState([])
      const [ledgerAt, setLedgerAt] = React.useState(null)
      const [extractionUsage, setExtractionUsage] = React.useState(null)
      const [globalHistory, setGlobalHistory] = React.useState([])
      const [children, setChildren] = React.useState([])
      const [showChildren, setShowChildren] = React.useState(true)
      const [flightRequest, setFlightRequest] = React.useState(0)
      const [showHistory, setShowHistory] = React.useState(false)
      const [notice, setNotice] = React.useState('')
      const [editing, setEditing] = React.useState(false)
      const [draft, setDraft] = React.useState([])
      const [busy, setBusy] = React.useState(true)
      const [copied, setCopied] = React.useState(false)
      const [exported, setExported] = React.useState(false)
      const [error, setError] = React.useState('')
      const busyRef = React.useRef(false)
      const lastPendingTurn = React.useRef(null)
      const childBoxRef = React.useRef(null)
      const childRowRefs = React.useRef(new Map())
      const previousChildren = React.useRef(new Set())
      const ghostCards = React.useRef([])

      const run = React.useCallback(async (force = false) => {
        if (sessionId === undefined || sessionId === '') {
          setError(t('panel.noSession'))
          setBusy(false)
          return
        }
        setBusy(true)
        busyRef.current = true
        setError('')
        try {
          const suffix = force ? '&refresh=1' : ''
          const [ledgerResult, globalResult, childResult] = await Promise.all([
            api(`/api/reqtrace.ledger?sessionId=${encodeURIComponent(sessionId)}`).catch(() => ({})),
            api('/api/reqtrace.ledgers').catch(() => ({ ledgers: [] })),
            api(`/api/reqtrace.children?sessionId=${encodeURIComponent(sessionId)}`).catch(() => ({ children: [] })),
          ])
          const requirements = ledgerResult.ledger?.requirements ?? []
          const persistedReport = ledgerResult.ledger?.report ?? null
          setLedger(requirements)
          setLedgerAt(ledgerResult.ledger?.at ?? null)
          setExtractionUsage(ledgerResult.ledger?.extractionUsage ?? null)
          setDraft(requirements)
          setGlobalHistory((globalResult.ledgers ?? []).slice(0, 10))
          setChildren(childResult.children ?? [])
          if (persistedReport !== null) setReport(persistedReport)
          if (persistedReport !== null && !force) return
          const result = await api(`/api/reqtrace.audit?sessionId=${encodeURIComponent(sessionId)}${suffix}`)
          setReport(result.report ?? persistedReport)
        } catch (failure) {
          setError(`${t('panel.failed')}: ${failure?.message ?? failure}`)
        } finally {
          setBusy(false)
          busyRef.current = false
        }
      }, [sessionId, t])

      React.useEffect(() => { void run(false) }, [run])

      React.useEffect(() => {
        const handler = (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            event.preventDefault()
            void run(true)
          }
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
      }, [run])

      React.useEffect(() => {
        if (sessionId === undefined || sessionId === '') return undefined
        let live = true
        const timer = setInterval(async () => {
          try {
            const state = await api(`/api/reqtrace.state?sessionId=${encodeURIComponent(sessionId)}`)
            if (!live) return
            if (state.pending === true && state.turn !== lastPendingTurn.current && !busyRef.current) {
              lastPendingTurn.current = state.turn
              void run(false)
            } else if (state.pending !== true) {
              lastPendingTurn.current = null
            }
          } catch { /* optional polling */ }
        }, 4000)
        return () => { live = false; clearInterval(timer) }
      }, [sessionId, run])

      React.useEffect(() => {
        const box = childBoxRef.current
        const current = new Set(children.map((child) => child.sessionId))
        const fresh = children.filter((child) => !previousChildren.current.has(child.sessionId))
        previousChildren.current = current
        if (!showChildren || box === null || fresh.length === 0) return undefined
        const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
        let cancelled = false

        const flash = (row) => {
          if (typeof row.animate !== 'function') return
          row.animate([
            { boxShadow: '0 0 0 0 rgba(98,168,255,.65)' },
            { boxShadow: '0 0 0 8px rgba(98,168,255,0)' },
          ], { duration: 500, easing: 'ease-out' })
        }

        const launch = (child, frame) => {
          const row = childRowRefs.current.get(child.sessionId)
          if (row === undefined) return
          if (reduced) {
            flash(row)
            return
          }
          const from = box.getBoundingClientRect()
          const to = row.getBoundingClientRect()
          const ghost = row.cloneNode(true)
          ghost.classList.add('reqtrace-ghost-card')
          Object.assign(ghost.style, {
            width: `${Math.max(220, to.width)}px`,
            height: `${Math.max(30, to.height)}px`,
            boxSizing: 'border-box',
            background: 'var(--dsw-alias-bg-layer-1)',
            border: '1px solid var(--dsw-alias-state-business-primary)',
            borderRadius: '8px',
            padding: '6px 8px',
            color: 'var(--dsw-alias-label-primary)',
            boxShadow: '0 14px 42px rgba(0,0,0,.45), 0 0 14px rgba(98,168,255,.22)',
            zIndex: '9999',
            opacity: '1',
            transform: `translate(${from.left + 10}px, ${from.top + 28}px)`,
          })
          document.body.append(ghost)
          ghostCards.current.push(ghost)
          const c1 = {
            x: from.left + 10 + (to.left - from.left - 10) * 0.28 - (to.top - from.top) * 0.1,
            y: from.top + 28 + (to.top - from.top - 28) * 0.28 + (to.left - from.left) * 0.1,
          }
          const c2 = {
            x: from.left + 10 + (to.left - from.left - 10) * 0.72 - (to.top - from.top) * 0.1,
            y: from.top + 28 + (to.top - from.top - 28) * 0.72 + (to.left - from.left) * 0.1,
          }
          const startedAt = performance.now()
          const duration = 900
          const tick = (now) => {
            if (cancelled) {
              ghost.remove()
              return
            }
            const t = Math.min(1, (now - startedAt) / duration)
            const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
            const q = 1 - e
            const x = q ** 3 * (from.left + 10) + 3 * q ** 2 * e * c1.x + 3 * q * e ** 2 * c2.x + e ** 3 * to.left
            const y = q ** 3 * (from.top + 28) + 3 * q ** 2 * e * c1.y + 3 * q * e ** 2 * c2.y + e ** 3 * to.top
            ghost.style.transform = `translate(${x}px, ${y}px) scale(${0.96 + 0.04 * e})`
            ghost.style.opacity = String(1 - Math.max(0, (t - 0.82) / 0.18))
            if (t < 1) {
              globalThis.requestAnimationFrame(tick)
            } else {
              ghost.remove()
              ghostCards.current = ghostCards.current.filter((item) => item !== ghost)
              flash(row)
            }
          }
          globalThis.requestAnimationFrame(tick)
        }

        const timers = []
        const raf = globalThis.requestAnimationFrame(() => {
          if (cancelled) return
          fresh.slice(0, 3).forEach((child, index) => {
            timers.push(globalThis.setTimeout(() => {
              if (!cancelled) launch(child, box)
            }, index * 90))
          })
        })
        return () => {
          cancelled = true
          if (typeof globalThis.cancelAnimationFrame === 'function') globalThis.cancelAnimationFrame(raf)
          for (const timer of timers) globalThis.clearTimeout(timer)
          for (const ghost of ghostCards.current) ghost.remove()
          ghostCards.current = []
        }
      }, [children, showChildren, flightRequest])

      React.useEffect(() => () => {
        for (const ghost of ghostCards.current) ghost.remove()
        ghostCards.current = []
      }, [])

      const copyReport = async () => {
        const text = typeof report === 'string' ? report : JSON.stringify(report, null, 2)
        try {
          await globalThis.navigator?.clipboard?.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          setError(t('panel.failed'))
        }
      }

      const exportReport = () => {
        const text = typeof report === 'string' ? report : JSON.stringify(report, null, 2)
        try {
          const blob = new Blob([text], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const anchor = document.createElement('a')
          anchor.href = url
          anchor.download = 'reqtrace-report.json'
          anchor.click()
          URL.revokeObjectURL(url)
          setExported(true)
          setTimeout(() => setExported(false), 1500)
        } catch {
          setError(t('panel.failed'))
        }
      }

      const resumeTask = async (index) => {
        setNotice('')
        setError('')
        try {
          const result = await resume?.(index)
          if (result?.ok === false) {
            setError(`${t('panel.resumeFailed')}: ${result.error?.message ?? result.error?.code ?? 'unknown'}`)
          } else {
            setNotice(t('panel.resumeSent'))
          }
        } catch (failure) {
          setError(`${t('panel.resumeFailed')}: ${failure?.message ?? failure}`)
        }
      }

      const saveLedger = async () => {
        try {
          const result = await api(`/api/reqtrace.ledger?sessionId=${encodeURIComponent(sessionId)}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ requirements: draft }),
          })
          setLedger(result.ledger?.requirements ?? [])
          setEditing(false)
          await run(true)
        } catch (failure) {
          setError(`${t('panel.failed')}: ${failure?.message ?? failure}`)
        }
      }

      return h('div', { style: card },
        h('div', { style: header },
          h('div', {
            style: {
              width: '30px',
              height: '30px',
              borderRadius: '9px',
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
              color: 'var(--dsw-alias-state-business-primary)',
              background: 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)',
            },
          }, h(Icon)),
          h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' } },
            h('strong', { style: { fontSize: '15px', lineHeight: '22px' } }, t('panel.title')),
            h('span', { style: { fontSize: '11px', lineHeight: '17px', color: 'var(--dsw-alias-label-tertiary)' } }, t('panel.description')),
          ),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', flex: 'none', alignSelf: 'center' } },
            report !== null ? h('button', {
              style: { ...button, flex: 'none', height: '24px', minHeight: '24px', padding: '2px 8px', fontSize: '11px', lineHeight: '16px' },
              onClick: () => void copyReport(),
            }, copied ? t('panel.copied') : t('panel.copy')) : null,
            report !== null ? h('button', {
              style: { ...button, flex: 'none', height: '24px', minHeight: '24px', padding: '2px 8px', fontSize: '11px', lineHeight: '16px' },
              onClick: () => void exportReport(),
            }, exported ? t('panel.exported') : t('panel.export')) : null,
            h('button', {
              style: { ...button, flex: 'none', height: '24px', minHeight: '24px', padding: '2px 8px', fontSize: '11px', lineHeight: '16px' },
              disabled: busy,
              onClick: () => void run(true),
            }, busy ? t('panel.running') : t('panel.run')),
          ),
        ),
        error !== '' ? h('div', { style: { color: 'var(--dsw-alias-state-error-primary)', fontSize: '12px', lineHeight: '18px' } }, error) : null,
        true ? h('div', {
          style: { display: 'flex', flexDirection: 'column', gap: '5px', padding: '7px 9px', borderRadius: '9px', background: 'var(--dsw-alias-bg-layer-2)' },
        },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          h('strong', { style: { flex: 1, fontSize: '11px', lineHeight: '17px', color: 'var(--dsw-alias-label-tertiary)' } }, `${t('panel.ledger')}${formatTime(ledgerAt) === '' ? '' : ` · ${formatTime(ledgerAt)}`}${formatUsage(extractionUsage) === '' ? '' : ` · 提取 ${formatUsage(extractionUsage)}`}`),
          h('button', {
            type: 'button',
            style: { ...button, padding: '1px 6px', fontSize: '10px', lineHeight: '15px' },
            onClick: () => {
              if (editing) {
                setDraft(ledger)
                setEditing(false)
              } else {
                setDraft(ledger)
                setEditing(true)
              }
            },
          }, editing ? t('panel.cancel') : t('panel.edit')),
        ),
        editing
          ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '5px' } },
            ...draft.map((item, index) => h('div', { key: `draft-${index}`, style: { display: 'flex', gap: '5px' } },
              h('input', {
                value: item,
                style: { flex: 1, minWidth: 0, borderRadius: '6px', border: '.5px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-1)', color: 'var(--dsw-alias-label-primary)', padding: '3px 6px', fontSize: '12px' },
                onChange: (event) => {
                  const next = [...draft]
                  next[index] = event.target.value
                  setDraft(next)
                },
              }),
              h('button', { type: 'button', style: { ...button, padding: '1px 5px', fontSize: '11px' }, onClick: () => setDraft(draft.filter((_, i) => i !== index)) }, '×'),
            )),
            h('div', { style: { display: 'flex', gap: '6px' } },
              h('button', { type: 'button', style: { ...button, padding: '2px 7px', fontSize: '11px' }, onClick: () => setDraft([...draft, '']) }, t('panel.add')),
              h('button', { type: 'button', style: { ...button, padding: '2px 7px', fontSize: '11px' }, onClick: () => void saveLedger() }, t('panel.saveLedger')),
            ),
          )
          : (ledger.length === 0
            ? h('span', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '11px', lineHeight: '17px' } }, t('panel.ledgerEmpty'))
            : ledger.map((item, index) => {
              let status = requirementStatus(report, item)
              let source = status === '' ? '' : '本任务'
              let sourceId = ''
              if (status === '') {
                for (const child of children) {
                  const childStatus = requirementStatus(child.report, item)
                  if (childStatus !== '') {
                    status = childStatus
                    source = child.title ?? child.sessionId
                    sourceId = child.sessionId
                    break
                  }
                }
              }
              const mark = statusMark(status)
              return h('span', { key: `ledger-${index}`, style: { display: 'flex', alignItems: 'baseline', gap: '5px', fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-secondary)' } },
                h('span', { style: { width: '10px', flex: 'none', color: mark.color, fontWeight: 600 } }, mark.text),
                h('span', null, `${index + 1}. ${item}`),
                source === '' ? null : (sourceId !== '' && typeof openSession === 'function'
                  ? h('button', { type: 'button', style: { ...button, border: 'none', background: 'transparent', padding: 0, fontSize: '10px', lineHeight: '15px', color: 'var(--dsw-alias-label-tertiary)' }, onClick: () => openSession({ sessions: [sourceId] }) }, `· ${source}`)
                  : h('span', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-tertiary)' } }, `· ${source}`)),
              )
            })),
        ) : null,
        children.length > 0 ? h('div', {
          ref: childBoxRef,
          className: 'reqtrace-children',
          style: { display: 'flex', flexDirection: 'column', gap: '5px', padding: '7px 9px', borderRadius: '9px', background: 'var(--dsw-alias-bg-layer-2)' },
        },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '5px' } },
          h('button', {
            type: 'button',
            style: { ...button, padding: '1px 6px', fontSize: '10px', lineHeight: '15px' },
            onClick: () => setShowChildren((value) => !value),
          }, `${t('panel.children')} (${children.length})`),
          showChildren ? h('button', {
            type: 'button',
            title: '重播卡片飞行',
            'aria-label': '重播卡片飞行',
            style: { ...button, flex: 'none', padding: '1px 5px', fontSize: '10px', lineHeight: '15px' },
            onClick: () => {
              previousChildren.current = new Set()
              setFlightRequest((value) => value + 1)
            },
          }, '▶') : null,
        ),
        ...(showChildren ? children.map((child, index) => h('div', {
          key: `child-${child.sessionId ?? index}`,
          ref: (element) => {
            if (element === null) childRowRefs.current.delete(child.sessionId)
            else childRowRefs.current.set(child.sessionId, element)
          },
          className: 'reqtrace-child-row',
          style: { display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: `${28 + Math.max(0, Number(child.delegationDepth ?? 1) - 1) * 10}px` },
        },
        h('span', { style: { flex: 1, minWidth: 0, fontSize: '11px', lineHeight: '17px', color: 'var(--dsw-alias-label-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, `${child.delegationDepth > 1 ? '↳ ' : ''}${child.title ?? child.sessionId} · ${(child.requirements ?? []).length} 条${child.report?.verdict === undefined ? '' : ` · ${child.report.verdict}`}`),
        typeof openSession === 'function' ? h('button', {
          type: 'button',
          style: { ...button, flex: 'none', padding: '1px 5px', fontSize: '10px', lineHeight: '15px' },
          onClick: () => openSession({ sessions: [child.sessionId] }),
        }, t('panel.openSession')) : null,
        )) : []),
        ) : null,
        globalHistory.length > 0 ? h('div', {
          style: { display: 'flex', flexDirection: 'column', gap: '5px', padding: '7px 9px', borderRadius: '9px', background: 'var(--dsw-alias-bg-layer-2)' },
        },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          h('button', {
            type: 'button',
            style: { ...button, flex: 1, textAlign: 'left', padding: '1px 6px', fontSize: '10px', lineHeight: '15px' },
            onClick: () => setShowHistory((value) => !value),
          }, `${t('panel.history')} (${globalHistory.length})`),
          notice !== '' ? h('span', { style: { fontSize: '10px', color: 'var(--dsw-alias-state-success-primary)' } }, notice) : null,
        ),
        showHistory ? globalHistory.map((item, index) => {
          const requirements = item.requirements ?? []
          return h('div', {
            key: `history-task-${index}`,
            style: { display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '4px 0', borderTop: index === 0 ? 'none' : '.5px solid var(--dsw-alias-border-l2)' },
          },
          h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1px' } },
            h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, `${index + 1}. ${item.subagent || item.parentSessionId ? '↳ ' : ''}${item.title ?? item.sessionId} · ${requirements.length} 条${formatTime(item.at) === '' ? '' : ` · ${formatTime(item.at)}`}`),
            h('span', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, requirements.slice(0, 2).join(' / ')),
          ),
          h('button', { type: 'button', style: { ...button, flex: 'none', padding: '1px 6px', fontSize: '10px', lineHeight: '15px' }, onClick: () => void resumeTask(index + 1) }, t('panel.resume')),
          )
        }) : null,
        ) : null,
        report !== null
          ? h(ReportView, { t, report, openSession })
          : h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px' } }, busy ? t('panel.running') : t('panel.empty')),
      )
    }

    function SettingsPage({ t }) {
      const [config, setConfig] = React.useState(null)
      const [history, setHistory] = React.useState([])
      const [expandedHistory, setExpandedHistory] = React.useState('')
      const [confirmClear, setConfirmClear] = React.useState(false)
      const [confirmClearId, setConfirmClearId] = React.useState('')
      const [saving, setSaving] = React.useState(false)
      const [saved, setSaved] = React.useState(false)
      const [error, setError] = React.useState('')

      React.useEffect(() => {
        let live = true
        const load = async () => {
          try {
            const [result, ledgerResult] = await Promise.all([
              api('/api/reqtrace.config'),
              api('/api/reqtrace.ledgers').catch(() => ({ ledgers: [] })),
            ])
            if (!live) return
            setConfig(result.config)
            setHistory(ledgerResult.ledgers ?? [])
          } catch (failure) {
            if (live) setError(`${t('settings.failed')}: ${failure?.message ?? failure}`)
          }
        }
        void load()
        return () => { live = false }
      }, [t])

      const clearAll = async () => {
        if (!confirmClear) {
          setConfirmClear(true)
          return
        }
        setError('')
        try {
          await api('/api/reqtrace.ledgers', { method: 'DELETE' })
          setHistory([])
          setConfirmClear(false)
          setSaved(false)
        } catch (failure) {
          setError(`${t('settings.failed')}: ${failure?.message ?? failure}`)
        }
      }

      const clearOne = async (ledger) => {
        if (confirmClearId !== ledger.id) {
          setConfirmClearId(ledger.id)
          return
        }
        setError('')
        try {
          await api(`/api/reqtrace.ledger?sessionId=${encodeURIComponent(ledger.sessionId)}&at=${encodeURIComponent(ledger.at ?? '')}`, { method: 'DELETE' })
          const result = await api('/api/reqtrace.ledgers')
          setHistory(result.ledgers ?? [])
          setConfirmClearId('')
        } catch (failure) {
          setError(`${t('settings.failed')}: ${failure?.message ?? failure}`)
        }
      }

      const save = async () => {
        setSaving(true)
        setSaved(false)
        setError('')
        try {
          const result = await api('/api/reqtrace.config', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(config),
          })
          setConfig(result.config)
          setSaved(true)
        } catch (failure) {
          setError(`${t('settings.failed')}: ${failure?.message ?? failure}`)
        } finally {
          setSaving(false)
        }
      }

      if (config === null) return h('div', { style: card }, error || '…')
      const row = { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '4px 0' }
      return h('div', { style: { ...card, maxWidth: '720px' } },
        h('div', { style: header },
          h('div', {
            style: {
              width: '30px', height: '30px', borderRadius: '9px', display: 'grid',
              placeItems: 'center', flex: 'none', color: 'var(--dsw-alias-state-business-primary)',
              background: 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)',
            },
          }, h(Icon)),
          h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' } },
            h('strong', { style: { fontSize: '15px', lineHeight: '22px' } }, t('settings.title')),
            h('span', { style: { fontSize: '11px', lineHeight: '17px', color: 'var(--dsw-alias-label-tertiary)' } }, t('settings.description')),
          ),
        ),
        h('div', { style: { height: '.5px', background: 'var(--dsw-alias-border-l2)', margin: '2px 0' } }),
        h('label', { style: row },
          h('span', { style: { fontSize: '13px' } }, t('settings.autoAudit')),
          h('input', {
            type: 'checkbox',
            checked: config.autoAudit === true,
            onChange: (event) => setConfig({ ...config, autoAudit: event.target.checked }),
          }),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '11px', lineHeight: '17px', marginTop: '-4px' } }, t('settings.autoAuditHint')),
        h('label', { style: row },
          h('span', { style: { fontSize: '13px' } }, t('settings.autoExtract')),
          h('input', {
            type: 'checkbox',
            checked: config.autoExtract === true,
            onChange: (event) => setConfig({ ...config, autoExtract: event.target.checked }),
          }),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '11px', lineHeight: '17px', marginTop: '-4px' } }, t('settings.autoExtractHint')),
        h('label', { style: row },
          h('span', { style: { fontSize: '13px' } }, t('settings.strict')),
          h('input', {
            type: 'checkbox',
            checked: config.strict === true,
            onChange: (event) => setConfig({ ...config, strict: event.target.checked }),
          }),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '11px', lineHeight: '17px', marginTop: '-4px' } }, t('settings.strictHint')),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '10px', lineHeight: '15px', marginTop: '2px' } }, t('settings.costHint')),
        h('label', { style: row },
          h('span', { style: { fontSize: '13px' } }, t('settings.minToolCalls')),
          h('input', {
            type: 'number',
            min: 1,
            max: 20,
            value: config.minToolCalls,
            style: { width: '70px', borderRadius: '7px', border: '.5px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)', padding: '4px 7px', fontSize: '12px' },
            onChange: (event) => setConfig({ ...config, minToolCalls: Number(event.target.value) }),
          }),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '11px', lineHeight: '17px', marginTop: '-4px' } }, t('settings.minToolCallsHint')),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' } },
          h('button', { style: { ...button, padding: '4px 12px', fontSize: '12px' }, disabled: saving, onClick: () => void save() }, saving ? t('settings.saving') : t('settings.save')),
          saved ? h('span', { style: { color: 'var(--dsw-alias-state-success-primary)', fontSize: '12px' } }, t('settings.saved')) : null,
          error ? h('span', { style: { color: 'var(--dsw-alias-state-error-primary)', fontSize: '12px' } }, error) : null,
        ),
        h('div', { style: { height: '.5px', background: 'var(--dsw-alias-border-l2)', margin: '4px 0' } }),
        h('strong', { style: { fontSize: '13px', lineHeight: '20px' } }, t('settings.history')),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '220px', overflow: 'auto' } },
          history.length === 0
            ? h('span', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px' } }, t('settings.historyEmpty'))
            : history.map((ledger) => {
              const expanded = expandedHistory === ledger.sessionId
              const requirements = ledger.requirements ?? []
              return h('div', {
                key: ledger.sessionId,
                style: { padding: '6px 8px', borderRadius: '8px', background: 'var(--dsw-alias-bg-layer-2)', display: 'flex', flexDirection: 'column', gap: '2px', cursor: 'pointer' },
                onClick: () => setExpandedHistory(expanded ? '' : ledger.sessionId),
              },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                h('span', { style: { flex: 1, minWidth: 0, fontSize: '12px', color: 'var(--dsw-alias-label-primary)' } }, `${ledger.subagent || ledger.parentSessionId ? '↳ ' : ''}${ledger.title ?? ledger.sessionId} · ${requirements.length} 条${formatTime(ledger.at) === '' ? '' : ` · ${formatTime(ledger.at)}`}`),
                h('button', {
                  type: 'button',
                  style: { ...button, flex: 'none', padding: '1px 5px', fontSize: '10px', lineHeight: '15px' },
                  onClick: (event) => {
                    event.stopPropagation()
                    void clearOne(ledger)
                  },
                }, confirmClearId === ledger.id ? t('settings.confirmClearOne') : t('settings.clearOne')),
              ),
              h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, requirements.slice(0, 2).join(' / ')),
              expanded ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '4px' } },
                ...requirements.map((item, index) => h('span', { key: `history-${index}`, style: { fontSize: '11px', color: 'var(--dsw-alias-label-secondary)' } }, `${index + 1}. ${item}`)),
              ) : null,
              )
            }),
        ),
        h('button', {
          type: 'button',
          style: {
            ...button,
            alignSelf: 'flex-start',
            padding: '3px 8px',
            fontSize: '11px',
            color: confirmClear ? 'var(--dsw-alias-state-error-primary)' : 'var(--dsw-alias-label-tertiary)',
          },
          onClick: () => void clearAll(),
        }, confirmClear ? t('settings.confirmClear') : t('settings.clearHistory')),
      )
    }

    function OpenButton({ t, open, sessionId }) {
      const [pending, setPending] = React.useState(false)

      React.useEffect(() => {
        if (sessionId === undefined || sessionId === '') return undefined
        let live = true
        const load = async () => {
          try {
            const result = await api(`/api/reqtrace.state?sessionId=${encodeURIComponent(sessionId)}`)
            if (live) setPending(result.pending === true)
          } catch { /* optional badge */ }
        }
        void load()
        const timer = setInterval(() => { void load() }, 3000)
        return () => { live = false; clearInterval(timer) }
      }, [sessionId])

      return h('button', {
        type: 'button',
        title: pending ? t('panel.pendingTitle') : t('panel.open'),
        'aria-label': pending ? t('panel.pendingTitle') : t('panel.open'),
        style: {
          position: 'relative',
          alignSelf: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22px',
          height: '22px',
          minWidth: '22px',
          minHeight: '22px',
          margin: '2px 2px 0',
          padding: 0,
          border: 'none',
          borderRadius: '6px',
          background: 'transparent',
          color: 'var(--dsw-alias-label-tertiary)',
          cursor: 'pointer',
        },
        onClick: open,
      },
      h(Icon, { size: 13 }),
      pending ? h('span', {
        style: {
          position: 'absolute',
          top: '3px',
          right: '3px',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'var(--dsw-alias-state-business-primary)',
          pointerEvents: 'none',
        },
      }) : null)
    }

    return {
      inject: ['slots', 'locale', 'sidebarRight', 'sidebarRightTabs', 'remote', 'remote.commands'],
      apply(ctx) {
        const t = ctx.locale.bind(NS)
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'reqtrace: dictionaries')
        ctx.effect(() => {
          const doc = globalThis.document
          if (doc?.head === undefined) return undefined
          const style = doc.createElement('style')
          style.dataset.reqtraceTrail = ''
          style.textContent = `
            .reqtrace-children { position: relative; }
            .reqtrace-child-row { position: relative; z-index: 1; }
            .reqtrace-ghost-card { position: fixed !important; left: 0 !important; top: 0 !important; margin: 0 !important; z-index: 9999; pointer-events: none; border-color: var(--dsw-alias-state-business-primary) !important; background: var(--dsw-alias-bg-layer-1) !important; box-shadow: 0 14px 42px rgba(0,0,0,.45), 0 0 14px rgba(98,168,255,.18); will-change: transform, opacity; }
          `
          doc.head.append(style)
          return () => style.remove()
        }, 'reqtrace: trail styles')
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'reqtrace',
          order: 39,
          label: () => t('settings.title'),
          locale: NS,
        }, SettingsPage))
        ctx.effect(() => ctx.sidebarRightTabs.register({
          id: 'dsh-reqtrace',
          kind: 'reqtrace',
          priority: 'extension',
          title: () => t('panel.title'),
          guide: [{
            id: 'reqtrace',
            order: 10,
            icon: Icon,
            title: () => t('panel.title'),
            description: () => t('panel.description'),
          }],
        }), 'reqtrace: tab type')
        ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab',
          key: 'dsh-reqtrace',
          locale: NS,
          inject: () => {
            const sessionId = ctx.sidebarRight.mounted?.getSnapshot?.()
            return {
              sessionId,
              resume: (index) => ctx.remote.commands.execute(sessionId, `/reqtrace resume ${index}`, []),
              openSession: (item) => {
                const childSessionId = Array.isArray(item?.sessions) ? item.sessions[0] : undefined
                const workspace = ctx.get?.('uiWorkspace')
                if (childSessionId !== undefined && typeof workspace?.openSession === 'function') {
                  workspace.openSession({ parentSessionId: sessionId, childSessionId, mode: 'unknown' })
                }
              },
            }
          },
        }, AuditPanel))
        ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
          name: 'conversation.input.left',
          id: 'reqtrace-open',
          order: 50,
          locale: NS,
          inject: (sessionId) => ({ sessionId, open: () => ctx.sidebarRight.openTab('reqtrace') }),
        }, OpenButton))
      },
    }
  },
})
