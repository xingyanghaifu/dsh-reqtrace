window.__ModuleLoader__.load({
  id: 'dsh-reqtrace',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'reqtrace'

    // Bird geometry and clip paths from Magpie (MIT): https://github.com/yetone/magpie
    const BIRD_DEFS = `<defs><path id="bird" fill="currentColor" fill-rule="evenodd" d="M1.5 5.5C1.3 5.7 1.2 6.5 1.2 6.9C1.2 6.9 1.2 7 1.2 7.1C1.1 7.4 1.3 8 1.4 8.3C1.4 8.4 1.5 8.5 1.5 8.7C1.5 8.9 1.7 9 1.8 9.3C2.2 9.9 2.2 10 2.3 10.1C2.4 10.2 2.5 10.3 2.6 10.5C2.8 10.8 3 11.1 3.2 11.3C3.3 11.3 3.4 11.6 3.6 11.8C3.8 12 4.1 12.4 4.2 12.5C4.7 13 5.2 13.7 5.4 13.9C6 14.5 6.5 15.1 6.7 15.3C6.7 15.4 6.9 15.5 6.9 15.7C7.3 15.9 7.7 16.5 7.9 16.8C7.9 16.8 8 16.9 8 16.9C8.1 16.9 8.2 17.2 8.2 17.3C8.2 17.3 8.1 17.2 8.1 17.1C7.9 16.9 7.9 16.9 7.6 16.6C7.5 16.5 7.4 16.5 7.4 16.3C7.2 16.2 6.7 15.7 6.3 15.2C6.1 15.1 6 14.9 6 14.9C5.9 14.8 5.7 14.7 5.7 14.6C5.6 14.5 5.4 14.3 5.3 14.2C5.1 14.1 4.9 13.8 4.7 13.5C4.5 13.3 4.2 13.1 4.1 12.9C4.1 12.9 3.8 12.7 3.8 12.5C3.5 12.3 3 11.8 2.8 11.4C1.8 10.5 0.9 9.6 0.7 9.6C0.6 9.7 0.6 9.8 0.5 10C0.5 10.1 0.6 10.2 0.5 10.3C0.5 10.4 0.6 10.5 0.6 10.6C0.5 10.7 0.5 10.9 0.6 11C0.5 11.1 0.6 11.4 0.6 11.5C0.9 12.9 1.3 13.8 2.8 14.9C2.9 15.1 3.3 15.3 3.4 15.4C3.4 15.5 3.6 15.6 3.7 15.7C4.2 16 6.4 17.8 7 18.4C7.4 18.8 7.4 18.8 7.5 18.9C7.6 19 7.7 19 7.7 19.1C7.7 19.2 7.8 19.2 7.9 19.2C7.9 19.3 8.1 19.4 8.1 19.5C8.2 19.6 8.2 19.7 8.3 19.7C8.3 19.7 8.3 19.7 8.2 19.7C8.2 19.6 8.1 19.6 8 19.6C7.9 19.5 7.9 19.4 7.8 19.4C7.7 19.3 7.6 19.2 7.6 19.2C7.6 19.1 7.5 19 7.3 18.9C7.2 18.9 6.9 18.6 6.7 18.4C6.1 17.8 4.5 16.6 3.5 16C3.4 15.8 3 15.6 2.9 15.5C2.6 15.3 1.5 14.6 0.9 14.3C0.7 14.1 0.6 14.1 0.6 14.2C0.5 14.5 0.8 15.9 0.9 16.1C0.9 16.2 1 16.2 0.9 16.3C1.2 16.8 1.9 17.6 2.7 18.3C2.8 18.5 4 19.2 4.7 19.5C6.2 20.5 6.6 20.7 7.4 21.5C8.2 22.2 8.7 22.7 9.3 23.6C9.5 24.1 9.9 24.4 10.3 25.3C10.4 25.5 10.5 25.8 10.5 25.8C10.7 25.8 10.8 25.7 11 25.4C11.6 25 11.9 24.6 12.3 24.3C12.8 24 13 23.8 13 23.7C13.1 23.7 13.1 23.8 13 24C12 24.8 11 26 10.2 26.9C10.1 27.1 9.9 27.5 9.7 27.7C9.5 27.8 9.4 28 9.4 28C9.4 28 9.3 28.3 9.1 28.5C8.6 29.2 7.7 30.8 7.7 30.9C7.7 31 7.8 31 8.3 30.8C9 30.4 9.5 30.2 10.4 30C11.7 29.6 12.5 29.6 11.6 30C10.5 30.2 9.7 30.6 9.2 31.2C8.8 31.7 8.8 31.7 9.3 31.7C10.1 31.8 10.9 31.9 11.6 32.2C12.8 32.7 13.5 33.1 15.5 34.8C16.4 35.5 17.3 36.2 17.8 36.4C17.9 36.5 18.1 36.7 18.2 36.8C19.1 37.3 21.2 38.1 22.3 38.3C22.4 38.3 22.7 38.3 22.8 38.3C22.8 38.5 23 38.5 23 38.5C23.1 38.5 23.2 38.5 23.3 38.5C23.6 38.6 25.9 38.6 26.1 38.5C26.2 38.5 26.3 38.5 26.4 38.5C26.5 38.5 26.6 38.5 26.7 38.3C26.7 38.3 27 38.3 27.1 38.3C28.3 38.1 30.2 37.3 31.4 36.7C31.5 36.7 31.7 36.4 31.8 36.4C32.2 36.2 33.2 35.4 33.4 35.2C34.2 34.5 35.5 33 35.8 32.6C35.8 32.5 36 32.2 36.1 32C36.4 31.8 36.6 31.4 36.6 31.2C36.7 31.1 36.8 30.9 36.9 30.8C37.2 30.4 37.5 29.6 37.7 29.2C37.7 29.1 37.8 28.7 37.9 28.7C38.1 28.5 38.4 27.1 38.5 26.8C39 25.2 39.1 23.7 39 22.4C39 22.2 38.9 21.9 38.9 21.8C38.9 21.7 38.9 21.6 38.9 21.4C38.6 20.5 38.5 19.9 38.2 19C37.9 18.5 37.5 17.5 37.3 17.2C37 16.8 36.8 15.8 36.8 15.2C36.8 13.8 37.7 12.7 39.6 12.2C40.1 12.1 41.3 11.8 42.1 11.7C43.5 11.5 43.5 11.5 43.4 11.3C42.9 10.7 40.9 9.9 39.2 9.7C37.9 9.5 38.1 9.5 37.6 9C37 8.6 36.4 8 36 7.9C36 7.8 35.8 7.8 35.7 7.7C35.1 7.3 34.2 7 33.1 6.9C32.6 6.7 31.6 6.9 31 7C29.6 7.3 28.3 8 27.3 9.2C26.7 9.8 26.2 10.8 25.7 11.7C25.5 12.1 24.8 13.4 24.7 13.7C24.6 13.9 24.5 14.1 24.1 14.7C23.5 15.7 22.1 16.9 20.6 17.8C20.5 18 20.3 18.2 20.1 18.3C19.7 18.5 19.4 18.8 19.1 19C18.9 19.1 18.7 19.3 18.5 19.4C18 19.8 17.2 20.3 17 20.5C16.9 20.5 16.8 20.6 16.7 20.7C16.3 20.8 16.1 20.9 16 20.9C15.5 20.8 14.9 20.5 14.2 20.2C13.7 19.8 12.7 18.9 12.4 18.6C12.3 18.5 12.2 18.4 12.1 18.2C11.9 18 11.2 17.1 11 16.6C10.9 16.5 10.8 16.4 10.7 16.3C10.7 16.2 10.6 16.1 10.6 15.9C10.5 15.9 10.4 15.7 10.4 15.6C10.3 15.5 10.2 15.2 10.1 15C10 14.8 9.8 14.4 9.7 14.2C9.6 14 9.5 13.7 9.4 13.6C9.4 13.4 9.3 13.2 9.2 13C9.2 12.8 9 12.6 9 12.5C8.9 12.3 8.7 12.1 8.7 12C8.7 12 8.5 11.7 8.5 11.7C8.3 11.2 8.2 10.9 7.5 10C6.4 8.3 4.2 6.4 2.7 5.8C2 5.5 1.6 5.4 1.5 5.5ZM28.4 16.7C29.2 16.9 29.7 17.2 29.9 17.7C30.1 18.2 30 18.9 29.6 19.4C29.2 19.9 28.2 20.9 27.6 21.2C26.8 21.7 25.3 22.4 24.2 22.7C23.9 22.8 23.6 22.9 23.5 22.9C22.8 23.2 20.7 23.7 19.6 24C19 24.2 18.4 24.3 18.1 24.4C17.9 24.4 16.1 24.9 15.3 25.1C14.6 25.2 14.7 25.1 15.7 23.6C16.4 22.7 18.5 20.6 19.4 19.9C20.8 18.8 21.4 18.4 23.2 17.6C23.8 17.4 25.6 16.8 25.9 16.8C25.9 16.8 26.3 16.8 26.6 16.7C26.8 16.7 28.2 16.7 28.4 16.7ZM30.4 20.2C30.5 20.3 30.6 20.6 30.6 20.7C31.7 23.1 33.4 24.6 35.6 25.3C36.1 25.5 36.7 25.7 37.2 25.8C37.7 25.8 37.8 25.9 37.8 26.1C37.7 26.2 37.7 26.3 37.7 26.5C37.7 26.6 37.7 26.8 37.6 27C37.4 28.5 36.8 29.9 36.1 31C36.1 31.2 35.9 31.4 35.9 31.6C35.7 31.9 35.2 32.6 34.7 33.3C32.6 35.6 29.7 37.3 26.6 37.8C26.5 37.8 26.3 37.9 26.2 37.9C25.8 37.9 23.7 37.9 23.3 37.9C23.2 37.9 23 37.8 22.9 37.8C21.1 37.6 19.3 36.8 18 35.7C17.7 35.4 17 34.7 16.8 34.5C16.3 33.8 16.1 33 16.3 32.5C16.5 31.8 16.8 31.6 17.9 31.1C19.1 30.5 19.4 30.4 20.2 30C21.4 29.4 23.2 28.4 23.9 27.9C23.9 27.8 24.2 27.7 24.5 27.6C26.3 26.3 28 24.6 28.9 22.9C29.5 22.2 29.7 21.6 29.9 20.7C30.1 20 30.2 19.9 30.4 20.2Z"/><clipPath id="bird-body"><path clip-rule="evenodd" d="M16 0H44V44H0V26.4H10.6L13 24.2L16 19Z M29.8 18.3L26 19L22 21L17 23.5L14.6 24.7L10.6 26.4L6 29V32L9 31.5L12.5 32L16.4 31.8L19 31.4L24 28.8L28.5 24L30.6 21.4Z"/></clipPath><clipPath id="bird-notail"><path d="M17 0H44V44H0V26.4H10.6L14 25L17.2 19.6Z"/></clipPath><clipPath id="bird-tail"><path d="M0 0H17L17.2 19.6L14 25L10.6 26.4H0Z"/></clipPath><clipPath id="bird-wing"><path d="M29.8 18.3L26 19L22 21L17 23.5L14.6 24.7L10.6 26.4L6 29V32L9 31.5L12.5 32L16.4 31.8L19 31.4L24 28.8L28.5 24L30.6 21.4Z"/></clipPath></defs>`
    let birdSerial = 0

    function createBird() {
      birdSerial += 1
      const id = `reqtrace-bird-${birdSerial}`
      const body = `reqtrace-bird-body-${birdSerial}`
      const notail = `reqtrace-bird-notail-${birdSerial}`
      const tail = `reqtrace-bird-tail-${birdSerial}`
      const wing = `reqtrace-bird-wing-${birdSerial}`
      const defs = BIRD_DEFS
        .replace('id="bird"', `id="${id}"`)
        .replace('id="bird-body"', `id="${body}"`)
        .replace('id="bird-notail"', `id="${notail}"`)
        .replace('id="bird-tail"', `id="${tail}"`)
        .replace('id="bird-wing"', `id="${wing}"`)
      const bird = document.createElement('div')
      bird.className = 'reqtrace-bird'
      bird.setAttribute('aria-hidden', 'true')
      bird.innerHTML = `<svg viewBox="0 0 44 44">${defs}<use href="#${id}" clip-path="url(#${body})"/><g class="tail"><use href="#${id}" clip-path="url(#${tail})"/></g><g class="wing"><use href="#${id}" clip-path="url(#${wing})"/></g></svg>`
      return bird
    }

    function pulseTarget(target) {
      if (typeof target.animate !== 'function') return
      target.animate([
        { boxShadow: '0 0 0 0 rgba(98,168,255,.65)' },
        { boxShadow: '0 0 0 8px rgba(98,168,255,0)' },
      ], { duration: 500, easing: 'ease-out' })
    }

    function dipTarget(target) {
      if (typeof target.animate !== 'function') return
      target.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(3px)', offset: 0.3 },
        { transform: 'translateY(-1px)', offset: 0.62 },
        { transform: 'translateY(0)' },
      ], { duration: 560, easing: 'ease-out' })
    }

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
      'panel.fix': '让 Agent 补齐',
      'panel.fixing': '补齐中…',
      'panel.fixSent': '已发送补齐指令',
      'panel.extract': '提取验收清单',
      'panel.extracting': '提取中…',
      'panel.todos': 'Agent 任务清单',
      'panel.todosLive': '实时',
      'panel.todosEmpty': 'Agent 还没有创建任务清单。',
      'panel.verify': '验证',
      'panel.verifying': '验证中…',
      'panel.verifyPass': '验证通过',
      'panel.verifyFail': '验证失败',
      'panel.verifyCommand': '验证命令',
      'panel.verifyCancel': '取消',
      'panel.verifyRun': '运行',
      'panel.noUsage': '模型未返回 token 用量',
      'panel.pendingTitle': '有新的任务待检查',
      'panel.ledger': '本次任务清单',
      'panel.ignore': '忽略',
      'panel.copy': '复制',
      'panel.copied': '已复制',
      'panel.export': '导出 JSON',
      'panel.exportMd': '导出 Markdown',
      'panel.exported': '已导出',
      'panel.edit': '编辑',
      'panel.cancel': '取消',
      'panel.add': '+ 添加',
      'panel.saveLedger': '保存清单',
      'panel.ledgerEmpty': '还没有清单，点“编辑”手动添加。',
      'panel.history': '历史任务',
      'panel.children': '子任务',
      'panel.resume': '继续',
      'panel.resumeTask': '继续这个任务',
      'panel.openHistory': '展开清单',
      'panel.closeHistory': '收起清单',
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
      'settings.auditMode': '审计方式',
      'settings.auditModeHint': '直接调用更快；子智能体独立复核会创建子会话，隔离性更好但更慢、消耗更多 token。',
      'settings.auditDirect': '直接调用',
      'settings.auditSubagent': '子智能体独立复核',
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
      'panel.fix': 'Ask Agent to finish',
      'panel.fixing': 'Sending…',
      'panel.fixSent': 'Fix request sent',
      'panel.extract': 'Extract checklist',
      'panel.extracting': 'Extracting…',
      'panel.todos': 'Agent task list',
      'panel.todosLive': 'live',
      'panel.todosEmpty': 'The agent has not created a task list yet.',
      'panel.verify': 'Verify',
      'panel.verifying': 'Verifying…',
      'panel.verifyPass': 'Verified',
      'panel.verifyFail': 'Verification failed',
      'panel.verifyCommand': 'Verification command',
      'panel.verifyCancel': 'Cancel',
      'panel.verifyRun': 'Run',
      'panel.noUsage': 'Model did not report token usage',
      'panel.pendingTitle': 'A new task is ready for audit',
      'panel.ledger': 'Task checklist',
      'panel.ignore': 'Ignore',
      'panel.copy': 'Copy',
      'panel.copied': 'Copied',
      'panel.export': 'Export JSON',
      'panel.exportMd': 'Export Markdown',
      'panel.exported': 'Exported',
      'panel.edit': 'Edit',
      'panel.cancel': 'Cancel',
      'panel.add': '+ Add',
      'panel.saveLedger': 'Save checklist',
      'panel.ledgerEmpty': 'No checklist yet. Click Edit to add one.',
      'panel.history': 'Task history',
      'panel.children': 'Subagent tasks',
      'panel.resume': 'Continue',
      'panel.resumeTask': 'Continue this task',
      'panel.openHistory': 'Open checklist',
      'panel.closeHistory': 'Collapse checklist',
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
      'settings.auditMode': 'Audit mode',
      'settings.auditModeHint': 'Direct is faster. Subagent review creates a child session: more isolated, slower and more tokens.',
      'settings.auditDirect': 'Direct call',
      'settings.auditSubagent': 'Subagent review',
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
      borderRadius: '16px',
      background: 'var(--dsw-alias-bg-layer-1)',
      color: 'var(--dsw-alias-label-primary)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxSizing: 'border-box',
      height: '100%',
      minHeight: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,.02)',
    }
    const header = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      flexWrap: 'wrap',
    }
    const button = {
      border: '.5px solid var(--dsw-alias-border-l2)',
      borderRadius: '8px',
      background: 'var(--dsw-alias-bg-layer-1)',
      color: 'var(--dsw-alias-label-primary)',
      padding: '5px 12px',
      fontSize: '12px',
      lineHeight: '18px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      fontWeight: 500,
    }
    const reportStyle = {
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
      fontFamily: 'var(--ds-font-family-code)',
      fontSize: '12px',
      lineHeight: '1.6',
      margin: 0,
      padding: '14px 16px',
      borderRadius: '10px',
      background: 'var(--dsw-alias-bg-layer-2)',
      color: 'var(--dsw-alias-label-secondary)',
      overflow: 'auto',
      flex: '1',
      minHeight: 0,
      boxShadow: 'inset 0 1px 2px rgba(0,0,0,.03)',
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
    const asList = (value) => Array.isArray(value) ? value : []
    const textOf = (value) => {
      if (typeof value === 'string') return value
      if (typeof value === 'number' || typeof value === 'boolean') return String(value)
      if (value === null || value === undefined) return ''
      try {
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    }

    function requirementStatus(report, text) {
      if (report === null || report === undefined || typeof report === 'string') return ''
      const wanted = normalizeRequirement(text)
      if (wanted === '') return ''
      const buckets = [['done', asList(report.done)], ['partial', asList(report.partial)], ['missing', asList(report.missing)]]
      for (const [status, items] of buckets) {
        for (const item of items) {
          const candidate = normalizeRequirement(item?.requirement)
          if (candidate === wanted || (candidate.length > 4 && wanted.length > 4 && (candidate.includes(wanted) || wanted.includes(candidate)))) return status
        }
      }
      return ''
    }

    function requirementEntry(report, text) {
      if (report === null || report === undefined || typeof report === 'string') return null
      const wanted = normalizeRequirement(text)
      if (wanted === '') return null
      for (const [status, items] of [['done', asList(report.done)], ['partial', asList(report.partial)], ['missing', asList(report.missing)]]) {
        for (const item of items) {
          const candidate = normalizeRequirement(item?.requirement)
          if (candidate === wanted || (candidate.length > 4 && wanted.length > 4 && (candidate.includes(wanted) || wanted.includes(candidate)))) {
            return { status, item }
          }
        }
      }
      return null
    }

    function requirementEvidence(report, text) {
      const found = requirementEntry(report, text)
      return found === null ? null : { tools: asList(found.item?.tools), files: asList(found.item?.files) }
    }

    function statusMark(status) {
      if (status === 'done') return { text: '✓', color: 'var(--dsw-alias-state-success-primary)' }
      if (status === 'partial') return { text: '!', color: 'var(--dsw-alias-state-warn-primary)' }
      if (status === 'missing') return { text: '×', color: 'var(--dsw-alias-state-error-primary)' }
      return { text: '·', color: 'var(--dsw-alias-label-tertiary)' }
    }

    function todoMark(status) {
      if (status === 'completed') return { text: '✓', color: 'var(--dsw-alias-state-success-primary)' }
      if (status === 'in_progress') return { text: '◐', color: 'var(--dsw-alias-state-business-primary)' }
      return { text: '○', color: 'var(--dsw-alias-label-tertiary)' }
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
      const list = asList(items)
      if (list.length === 0) return null
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' } },
          h('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: color, flex: 'none', boxShadow: `0 0 4px ${color}40` } }),
          h('strong', { style: { fontSize: '13px', lineHeight: '20px', color: 'var(--dsw-alias-label-primary)', fontWeight: 600 } }, `${title} (${list.length})`),
        ),
        ...list.map((item, index) => {
          const entry = item !== null && typeof item === 'object' ? item : {}
          const view = render(entry) ?? {}
          const hasTools = Array.isArray(entry.tools) && entry.tools.length > 0
          const hasFiles = Array.isArray(entry.files) && entry.files.length > 0
          return h('div', {
            key: `${title}-${index}`,
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'var(--dsw-alias-bg-layer-2)',
              minWidth: 0,
              border: '.5px solid transparent',
              transition: 'all 0.2s ease',
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.borderColor = 'var(--dsw-alias-border-l2)'
              e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-bg-layer-2) 95%, var(--dsw-alias-state-business-primary) 5%)'
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.style.background = 'var(--dsw-alias-bg-layer-2)'
            },
          },
          h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '10px' } },
            h('span', { style: { flex: 1, fontSize: '13px', lineHeight: '20px', color: 'var(--dsw-alias-label-primary)', overflowWrap: 'anywhere', fontWeight: 500 } }, textOf(view.title)),
            onIgnore === undefined ? null : h('button', {
              type: 'button',
              style: { 
                ...button, 
                flex: 'none', 
                padding: '2px 8px', 
                fontSize: '11px', 
                lineHeight: '16px',
                background: 'transparent',
                color: 'var(--dsw-alias-label-tertiary)',
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = 'var(--dsw-alias-bg-layer-3)'
                e.currentTarget.style.color = 'var(--dsw-alias-label-primary)'
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--dsw-alias-label-tertiary)'
              },
              onClick: () => onIgnore(view.title),
            }, t('panel.ignore')),
            onOpen === undefined || entry.sessions?.length === undefined || entry.sessions.length === 0 ? null : h('button', {
              type: 'button',
              style: { 
                ...button, 
                flex: 'none', 
                padding: '2px 8px', 
                fontSize: '11px', 
                lineHeight: '16px',
                background: 'var(--dsw-alias-state-business-primary)',
                color: 'white',
                borderColor: 'var(--dsw-alias-state-business-primary)',
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 85%, black 15%)'
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'
              },
              onClick: () => onOpen(entry),
            }, t('panel.openSession')),
          ),
          textOf(view.detail) === '' ? null : h('div', { style: { fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)', overflowWrap: 'anywhere' } }, textOf(view.detail)),
          hasTools ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' } },
            h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-quaternary)' } }, '🔧'),
            ...entry.tools.slice(0, 8).map((tool, ti) => 
              h('span', {
                key: `tool-${ti}`,
                style: {
                  fontSize: '11px',
                  lineHeight: '17px',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  background: 'var(--dsw-alias-bg-layer-3)',
                  color: 'var(--dsw-alias-label-secondary)',
                  fontFamily: 'var(--ds-font-family-code)',
                  border: '.5px solid var(--dsw-alias-border-l2)',
                },
              }, textOf(tool))
            ),
            entry.tools.length > 8 ? h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-quaternary)' } }, `+${entry.tools.length - 8}`) : null,
          ) : null,
          Array.isArray(entry.commands) && entry.commands.length > 0 ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
            ...entry.commands.slice(0, 8).map((command, ci) => h('div', {
              key: `command-${ci}`,
              style: { fontSize: '11px', lineHeight: '17px', color: 'var(--dsw-alias-label-secondary)', fontFamily: 'var(--ds-font-family-code)', overflowWrap: 'anywhere' },
            }, `$ ${textOf(command)}`)),
          ) : null,
          hasFiles ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px' } },
            ...entry.files.slice(0, 5).map((file, fi) => 
              h('div', {
                key: `file-${fi}`,
                style: {
                  fontSize: '11px',
                  lineHeight: '18px',
                  color: 'var(--dsw-alias-label-tertiary)',
                  fontFamily: 'var(--ds-font-family-code)',
                  paddingLeft: '18px',
                  overflowWrap: 'anywhere',
                },
              }, `📄 ${textOf(file)}`)
            ),
            entry.files.length > 5 ? h('div', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-quaternary)', paddingLeft: '18px' } }, `... 还有 ${entry.files.length - 5} 个文件`) : null,
          ) : null,
          )
        }),
      )
    }

    function ReportView({ t, report, openSession, onFix }) {
      const [ignored, setIgnored] = React.useState(() => new Set())
      const [fixing, setFixing] = React.useState(false)
      const [fixNotice, setFixNotice] = React.useState('')
      const ignore = (value) => setIgnored((current) => {
        const next = new Set(current)
        next.add(value)
        return next
      })
      const runFix = async () => {
        if (typeof onFix !== 'function' || fixing) return
        setFixing(true)
        setFixNotice('')
        try {
          await onFix()
          setFixNotice(t('panel.fixSent'))
        } catch {
          setFixNotice('')
        } finally {
          setFixing(false)
        }
      }
      if (report === null || report === undefined) {
        return h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px' } }, t('panel.empty'))
      }
      if (typeof report === 'string') {
        return h('pre', { style: reportStyle }, report)
      }
      if (typeof report.raw === 'string' && report.raw !== '') {
        return h('pre', { style: reportStyle }, report.raw)
      }
      const missing = asList(report.missing).filter((item) => !ignored.has(item?.requirement))
      const partial = asList(report.partial).filter((item) => !ignored.has(item?.requirement))
      const done = asList(report.done)
      const extra = asList(report.extra)
      const counts = `${done.length} ${t('panel.done')} · ${partial.length} ${t('panel.partial')} · ${missing.length} ${t('panel.missing')} · ${extra.length} ${t('panel.extra')}`
      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px', overflow: 'auto', flex: 1, minHeight: 0 } },
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            flexWrap: 'wrap',
            padding: '12px 14px',
            borderRadius: '10px',
            background: 'var(--dsw-alias-bg-layer-2)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.02)',
          },
        },
        h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)', fontWeight: 600 } }, t('panel.summary')),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 } },
          h('strong', { style: { fontSize: '14px', color: 'var(--dsw-alias-label-primary)', fontWeight: 600 } }, counts),
          typeof report.verdict === 'string' && report.verdict !== '' ? h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, report.verdict) : null,
        ),
        h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)' } }, formatUsage(report.usage) === '' ? t('panel.noUsage') : formatUsage(report.usage)),
        missing.length + partial.length > 0 && typeof onFix === 'function' ? h('button', {
          type: 'button',
          disabled: fixing,
          style: {
            ...button,
            flex: 'none',
            padding: '4px 10px',
            fontSize: '11px',
            lineHeight: '16px',
            background: fixing ? 'var(--dsw-alias-bg-layer-3)' : 'var(--dsw-alias-state-business-primary)',
            color: fixing ? 'var(--dsw-alias-label-secondary)' : 'white',
            borderColor: fixing ? 'var(--dsw-alias-border-l2)' : 'var(--dsw-alias-state-business-primary)',
            fontWeight: 600,
          },
          onClick: () => void runFix(),
        }, fixing ? t('panel.fixing') : t('panel.fix')) : null,
        fixNotice !== '' ? h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-state-success-primary)' } }, fixNotice) : null,
        ),
        h(ReportSection, {
          t,
          title: t('panel.next'),
          color: 'var(--dsw-alias-state-business-primary)',
          items: asList(report.next),
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
          items: extra,
          render: (item) => ({ title: textOf(item), detail: '' }),
        }),
        h(ReportSection, {
          t,
          title: t('panel.conflicts'),
          color: 'var(--dsw-alias-state-warn-primary)',
          items: asList(report.conflicts),
          render: (item) => ({ title: typeof item === 'string' ? item : item.text, detail: '' }),
          onOpen: openSession,
        }),
        done.length + partial.length + missing.length === 0 && extra.length === 0 ? h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px' } }, t('panel.empty')) : null,
      )
    }

    function AuditPanel({ sessionId, t, resume, fix, extract, openSession }) {
      const [report, setReport] = React.useState(null)
      const [ledger, setLedger] = React.useState([])
      const [ledgerAt, setLedgerAt] = React.useState(null)
      const [extractionUsage, setExtractionUsage] = React.useState(null)
      const [globalHistory, setGlobalHistory] = React.useState([])
      const [children, setChildren] = React.useState([])
      const [todos, setTodos] = React.useState([])
      const [showChildren, setShowChildren] = React.useState(true)
      const [flightRequest, setFlightRequest] = React.useState(0)
      const [showHistory, setShowHistory] = React.useState(false)
      const [expandedHistory, setExpandedHistory] = React.useState('')
      const [notice, setNotice] = React.useState('')
      const [editing, setEditing] = React.useState(false)
      const [draft, setDraft] = React.useState([])
      const [busy, setBusy] = React.useState(true)
      const [extracting, setExtracting] = React.useState(false)
      const [verifications, setVerifications] = React.useState({})
      const [verifyFor, setVerifyFor] = React.useState('')
      const [verifyCommand, setVerifyCommand] = React.useState('npm test')
      const [verifying, setVerifying] = React.useState(false)
      const [showActions, setShowActions] = React.useState(false)
      const [copied, setCopied] = React.useState(false)
      const [exported, setExported] = React.useState(false)
      const [error, setError] = React.useState('')
      const busyRef = React.useRef(false)
      const lastPendingTurn = React.useRef(null)
      const ledgerBoxRef = React.useRef(null)
      const reportBoxRef = React.useRef(null)
      const childBoxRef = React.useRef(null)
      const childRowRefs = React.useRef(new Map())
      const previousChildren = React.useRef(new Set())
      const flyingBirds = React.useRef([])
      const lastReportKey = React.useRef('')

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
          const [ledgerResult, globalResult, childResult, todoResult] = await Promise.all([
            api(`/api/reqtrace.ledger?sessionId=${encodeURIComponent(sessionId)}`).catch(() => ({})),
            api('/api/reqtrace.ledgers').catch(() => ({ ledgers: [] })),
            api(`/api/reqtrace.children?sessionId=${encodeURIComponent(sessionId)}`).catch(() => ({ children: [] })),
            api(`/api/reqtrace.todos?sessionId=${encodeURIComponent(sessionId)}`).catch(() => ({ todos: [] })),
          ])
          const requirements = ledgerResult.ledger?.requirements ?? []
          const persistedReport = ledgerResult.ledger?.report ?? null
          setLedger(requirements)
          setLedgerAt(ledgerResult.ledger?.at ?? null)
          setExtractionUsage(ledgerResult.ledger?.extractionUsage ?? null)
          setDraft(requirements)
          setVerifications(ledgerResult.ledger?.verifications ?? {})
          setGlobalHistory((globalResult.ledgers ?? []).slice(0, 10))
          setChildren(childResult.children ?? [])
          setTodos(todoResult.todos ?? [])
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
        if (sessionId === undefined || sessionId === '') return undefined
        let live = true
        const load = async () => {
          try {
            const result = await api(`/api/reqtrace.todos?sessionId=${encodeURIComponent(sessionId)}`)
            if (live) setTodos(result.todos ?? [])
          } catch { /* optional live task list */ }
        }
        void load()
        const timer = setInterval(() => { void load() }, 2000)
        return () => { live = false; clearInterval(timer) }
      }, [sessionId])

      React.useEffect(() => {
        const box = childBoxRef.current
        const current = new Set(children.map((child) => child.sessionId))
        const fresh = children.filter((child) => !previousChildren.current.has(child.sessionId))
        previousChildren.current = current
        if (!showChildren || box === null || fresh.length === 0) return undefined
        const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
        let cancelled = false

        const flash = (row, withRing = false) => {
          if (withRing) {
            const rect = row.getBoundingClientRect()
            const ring = document.createElement('div')
            ring.className = 'reqtrace-landing-ring'
            ring.style.left = `${rect.left + rect.width / 2}px`
            ring.style.top = `${rect.top + rect.height / 2}px`
            document.body.append(ring)
            ring.addEventListener('animationend', () => ring.remove(), { once: true })
          }
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
            flash(row, false)
            return
          }
          const sourceBox = ledgerBoxRef.current !== null && ledger.length > 0 ? ledgerBoxRef.current : box
          const from = sourceBox.getBoundingClientRect()
          const to = row.getBoundingClientRect()
          const startX = from.left + 16
          const startY = from.top + 16
          const endX = to.left + Math.min(18, to.width / 2)
          const endY = to.top + Math.min(18, to.height / 2)
          const bird = createBird()
          const dir = endX >= startX ? 1 : -1
          bird.style.transform = `translate(${startX}px, ${startY}px) scaleX(${dir})`
          document.body.append(bird)
          flyingBirds.current.push(bird)
          const dx = endX - startX
          const dy = endY - startY
          const lift = Math.min(58, Math.max(18, Math.hypot(dx, dy) * 0.22))
          const c1 = { x: startX + dx * 0.3, y: Math.min(startY, endY) - lift }
          const c2 = { x: startX + dx * 0.7, y: Math.min(startY, endY) - lift }
          const startedAt = performance.now()
          const duration = 850
          const tick = (now) => {
            if (cancelled) {
              bird.remove()
              return
            }
            const t = Math.min(1, (now - startedAt) / duration)
            const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
            const q = 1 - e
            const x = q ** 3 * startX + 3 * q ** 2 * e * c1.x + 3 * q * e ** 2 * c2.x + e ** 3 * endX
            const y = q ** 3 * startY + 3 * q ** 2 * e * c1.y + 3 * q * e ** 2 * c2.y + e ** 3 * endY
            const scale = 0.58 + 0.42 * Math.min(1, t / 0.18) - 0.04 * Math.sin(Math.PI * t)
            bird.style.transform = `translate(${x}px, ${y}px) rotate(${(t - 0.5) * 12 * dir}deg) scaleX(${dir}) scale(${scale})`
            if (t < 1) {
              globalThis.requestAnimationFrame(tick)
            } else {
              dipTarget(row)
              flash(row, true)
              const end = bird.style.transform
              if (typeof bird.animate === 'function') {
                bird.animate([
                  { opacity: 1, transform: end },
                  { opacity: 0, transform: `${end} scale(.6)` },
                ], { duration: 160, easing: 'ease-in', fill: 'forwards' }).onfinish = () => {
                  bird.remove()
                  flyingBirds.current = flyingBirds.current.filter((item) => item !== bird)
                }
              } else {
                bird.remove()
                flyingBirds.current = flyingBirds.current.filter((item) => item !== bird)
              }
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
          for (const bird of flyingBirds.current) bird.remove()
          flyingBirds.current = []
        }
      }, [children, showChildren, flightRequest])

      React.useEffect(() => () => {
        for (const bird of flyingBirds.current) bird.remove()
        flyingBirds.current = []
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

      const exportMarkdown = () => {
        const lines = ['# 需求对账报告', '']
        lines.push(`- 会话：${sessionId}`)
        lines.push(`- 生成：${formatTime(Date.now())}`)
        if (typeof report === 'string') {
          lines.push('', '```text', report, '```')
        } else if (report !== null && report !== undefined) {
          const done = asList(report.done)
          const partial = asList(report.partial)
          const missing = asList(report.missing)
          const extra = asList(report.extra)
          lines.push(`- 结论：${done.length} 完成 · ${partial.length} 部分 · ${missing.length} 缺失 · ${extra.length} 超出`)
          if (typeof report.verdict === 'string' && report.verdict !== '') lines.push(`- 模型结论：${report.verdict}`)
          const section = (title, items, detailOf) => {
            if (items.length === 0) return
            lines.push('', `## ${title}`, '')
            for (const item of items) {
              const entry = item !== null && typeof item === 'object' ? item : {}
              const titleText = textOf(entry.requirement ?? entry.action ?? entry.text ?? item)
              lines.push(`- **${titleText}**${detailOf(entry) ? ` — ${textOf(detailOf(entry))}` : ''}`)
              if (entry.tools?.length) lines.push(`  - 工具：${entry.tools.map(textOf).join(', ')}`)
              if (entry.commands?.length) lines.push(`  - 命令：${entry.commands.map(textOf).join(' · ')}`)
              if (entry.files?.length) lines.push(`  - 文件：${entry.files.map(textOf).join(', ')}`)
            }
          }
          section('需要处理', missing, (item) => item.why)
          section('部分完成', partial, (item) => item.missing)
          section('先看这几条', asList(report.next), (item) => item.why)
          section('已完成', done, (item) => item.evidence)
          section('超出范围', extra, () => '')
          section('潜在冲突', asList(report.conflicts), (item) => item.text)
        } else {
          lines.push('', '还没有对账结果。')
        }
        if (children.length > 0) {
          lines.push('', '## 子任务', '')
          for (const child of children) {
            lines.push(`- ${child.title ?? child.sessionId} · ${(child.requirements ?? []).length} 条${child.report?.verdict ? ` · ${textOf(child.report.verdict)}` : ''}`)
          }
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'reqtrace-report.md'
        anchor.click()
        URL.revokeObjectURL(url)
        setExported(true)
        setTimeout(() => setExported(false), 1500)
      }

      const playDemoFlight = () => {
        const source = ledgerBoxRef.current
        const target = reportBoxRef.current
        if (source === null || target === null) return
        const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
        if (reduced) {
          target.animate([
            { boxShadow: '0 0 0 0 rgba(98,168,255,.7)' },
            { boxShadow: '0 0 0 8px rgba(98,168,255,0)' },
          ], { duration: 500, easing: 'ease-out' })
          return
        }
        const from = source.getBoundingClientRect()
        const to = target.getBoundingClientRect()
        const startX = from.left + 16
        const startY = from.top + 16
        const endX = to.left + 16
        const endY = to.top + Math.min(18, to.height / 2)
        const bird = createBird()
        const dir = endX >= startX ? 1 : -1
        bird.style.transform = `translate(${startX}px, ${startY}px) scaleX(${dir})`
        document.body.append(bird)
        flyingBirds.current.push(bird)
        const dx = endX - startX
        const dy = endY - startY
        const lift = Math.min(58, Math.max(18, Math.hypot(dx, dy) * 0.22))
        const c1 = { x: startX + dx * 0.3, y: Math.min(startY, endY) - lift }
        const c2 = { x: startX + dx * 0.7, y: Math.min(startY, endY) - lift }
        const startedAt = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - startedAt) / 850)
          const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
          const q = 1 - e
          const x = q ** 3 * startX + 3 * q ** 2 * e * c1.x + 3 * q * e ** 2 * c2.x + e ** 3 * endX
          const y = q ** 3 * startY + 3 * q ** 2 * e * c1.y + 3 * q * e ** 2 * c2.y + e ** 3 * endY
          const scale = 0.58 + 0.42 * Math.min(1, t / 0.18) - 0.04 * Math.sin(Math.PI * t)
          bird.style.transform = `translate(${x}px, ${y}px) rotate(${(t - 0.5) * 12 * dir}deg) scaleX(${dir}) scale(${scale})`
          if (t < 1) {
            globalThis.requestAnimationFrame(tick)
          } else {
            dipTarget(target)
            pulseTarget(target)
            const end = bird.style.transform
            if (typeof bird.animate === 'function') {
              bird.animate([
                { opacity: 1, transform: end },
                { opacity: 0, transform: `${end} scale(.6)` },
              ], { duration: 160, easing: 'ease-in', fill: 'forwards' }).onfinish = () => {
                bird.remove()
                flyingBirds.current = flyingBirds.current.filter((item) => item !== bird)
              }
            } else {
              bird.remove()
              flyingBirds.current = flyingBirds.current.filter((item) => item !== bird)
            }
          }
        }
        globalThis.requestAnimationFrame(tick)
      }

      React.useEffect(() => {
        if (report === null || report === undefined) {
          lastReportKey.current = ''
          return undefined
        }
        const key = typeof report === 'string' ? report : JSON.stringify(report)
        if (key === lastReportKey.current) return undefined
        lastReportKey.current = key
        const timer = setTimeout(() => playDemoFlight(), 180)
        return () => clearTimeout(timer)
      }, [report])

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

      const extractLedger = async () => {
        if (extracting || typeof extract !== 'function') return
        setExtracting(true)
        setError('')
        try {
          const result = await extract()
          if (result?.ok === false) setError(result.text ?? t('panel.failed'))
          else await run(true)
        } catch (failure) {
          setError(`${t('panel.failed')}: ${failure?.message ?? failure}`)
        } finally {
          setExtracting(false)
        }
      }

      const runVerification = async () => {
        const requirement = verifyFor.trim()
        const command = verifyCommand.trim()
        if (requirement === '' || command === '' || verifying) return
        setVerifying(true)
        setError('')
        try {
          const payload = await api('/api/reqtrace.verify', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ sessionId, requirement, command }),
          })
          const result = payload.result ?? {}
          setVerifications((current) => ({
            ...current,
            [requirement]: { command, ok: result.passed === true, output: result.output ?? '', at: result.at ?? Date.now() },
          }))
          if (result.passed !== true) setError(t('panel.verifyFail'))
        } catch (failure) {
          setError(`${t('panel.verifyFail')}: ${failure?.message ?? failure}`)
        } finally {
          setVerifying(false)
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
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
              color: 'var(--dsw-alias-state-business-primary)',
              background: 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)',
              boxShadow: '0 2px 4px rgba(0,0,0,.04)',
            },
          }, h(Icon, { size: 20 })),
          h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' } },
            h('strong', { style: { fontSize: '16px', lineHeight: '24px', fontWeight: 600 } }, t('panel.title')),
            h('span', { style: { fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' } }, t('panel.description')),
          ),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flex: 'none', alignSelf: 'center' } },
            report !== null ? h('div', { style: { position: 'relative', flex: 'none' } },
              h('button', {
                type: 'button',
                title: '更多操作',
                'aria-label': '更多操作',
                style: { ...button, width: '28px', minWidth: '28px', height: '28px', minHeight: '28px', padding: 0, fontSize: '14px', lineHeight: '16px' },
                onClick: () => setShowActions((value) => !value),
              }, '⋯'),
              showActions ? h('div', {
                style: {
                  position: 'absolute',
                  right: 0,
                  top: '32px',
                  zIndex: 20,
                  minWidth: '110px',
                  padding: '4px',
                  borderRadius: '8px',
                  border: '.5px solid var(--dsw-alias-border-l2)',
                  background: 'var(--dsw-alias-bg-layer-1)',
                  boxShadow: '0 8px 24px rgba(0,0,0,.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                },
              },
              h('button', {
                type: 'button',
                style: { ...button, border: 'none', background: 'transparent', textAlign: 'left', padding: '5px 8px', fontSize: '12px' },
                onClick: () => { setShowActions(false); void copyReport() },
              }, copied ? t('panel.copied') : t('panel.copy')),
              h('button', {
                type: 'button',
                style: { ...button, border: 'none', background: 'transparent', textAlign: 'left', padding: '5px 8px', fontSize: '12px' },
                onClick: () => { setShowActions(false); void exportReport() },
              }, exported ? t('panel.exported') : t('panel.export')),
              h('button', {
                type: 'button',
                style: { ...button, border: 'none', background: 'transparent', textAlign: 'left', padding: '5px 8px', fontSize: '12px' },
                onClick: () => { setShowActions(false); exportMarkdown() },
              }, t('panel.exportMd')),
              ) : null,
            ) : null,
            h('button', {
              style: { 
                ...button, 
                flex: 'none', 
                height: '28px', 
                minHeight: '28px', 
                padding: '4px 12px', 
                fontSize: '12px', 
                lineHeight: '18px',
                background: busy ? 'var(--dsw-alias-bg-layer-2)' : 'var(--dsw-alias-state-business-primary)',
                color: busy ? 'var(--dsw-alias-label-primary)' : 'white',
                borderColor: busy ? 'var(--dsw-alias-border-l2)' : 'var(--dsw-alias-state-business-primary)',
              },
              disabled: busy,
              onMouseEnter: (e) => {
                if (!busy) {
                  e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 85%, black 15%)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              },
              onMouseLeave: (e) => {
                if (!busy) {
                  e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              },
              onClick: () => void run(true),
            }, busy ? t('panel.running') : t('panel.run')),
          ),
        ),
        error !== '' ? h('div', { style: { color: 'var(--dsw-alias-state-error-primary)', fontSize: '13px', lineHeight: '20px', padding: '10px 14px', borderRadius: '10px', background: 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent)' } }, error) : null,
        todos.length > 0 ? h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '12px 14px',
            borderRadius: '10px',
            background: 'var(--dsw-alias-bg-layer-2)',
            borderLeft: '2px solid var(--dsw-alias-state-business-primary)',
          },
        },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' } },
          h('strong', { style: { fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-secondary)', fontWeight: 600 } }, t('panel.todos')),
          h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--dsw-alias-state-success-primary)' } },
            h('span', { style: { width: '5px', height: '5px', borderRadius: '50%', background: 'var(--dsw-alias-state-success-primary)' } }),
            t('panel.todosLive'),
          ),
          h('span', { style: { marginLeft: 'auto', fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)' } }, `${todos.filter((todo) => todo.status === 'completed').length}/${todos.length}`),
        ),
        ...todos.map((todo, index) => {
          const mark = todoMark(todo.status)
          return h('div', { key: `todo-${index}`, style: { display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '12px', lineHeight: '19px' } },
            h('span', { style: { width: '14px', flex: 'none', color: mark.color, fontWeight: 700 } }, mark.text),
            h('span', { style: { flex: 1, color: todo.status === 'completed' ? 'var(--dsw-alias-label-tertiary)' : 'var(--dsw-alias-label-primary)', textDecoration: todo.status === 'completed' ? 'line-through' : 'none' } }, textOf(todo.status === 'in_progress' && todo.activeForm !== '' ? todo.activeForm : todo.content)),
          )
        }),
        ) : null,
        true ? h('div', {
          ref: ledgerBoxRef,
          style: { 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            padding: '12px 14px', 
            borderRadius: '10px', 
            background: 'var(--dsw-alias-bg-layer-2)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.02)',
          },
        },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
          h('strong', { style: { flex: 1, fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-secondary)', fontWeight: 600 } }, `${t('panel.ledger')}${formatTime(ledgerAt) === '' ? '' : ` · ${formatTime(ledgerAt)}`}${formatUsage(extractionUsage) === '' ? '' : ` · 提取 ${formatUsage(extractionUsage)}`}`),
          h('button', {
            type: 'button',
            style: { 
              ...button, 
              padding: '3px 10px', 
              fontSize: '11px', 
              lineHeight: '16px',
              background: editing ? 'transparent' : 'var(--dsw-alias-bg-layer-3)',
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = editing ? 'var(--dsw-alias-bg-layer-3)' : 'var(--dsw-alias-state-business-primary)'
              e.currentTarget.style.color = editing ? 'var(--dsw-alias-label-primary)' : 'white'
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = editing ? 'transparent' : 'var(--dsw-alias-bg-layer-3)'
              e.currentTarget.style.color = 'var(--dsw-alias-label-primary)'
            },
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
          ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
            ...draft.map((item, index) => h('div', { key: `draft-${index}`, style: { display: 'flex', gap: '8px' } },
              h('input', {
                value: item,
                style: { 
                  flex: 1, 
                  minWidth: 0, 
                  borderRadius: '8px', 
                  border: '.5px solid var(--dsw-alias-border-l2)', 
                  background: 'var(--dsw-alias-bg-layer-1)', 
                  color: 'var(--dsw-alias-label-primary)', 
                  padding: '6px 10px', 
                  fontSize: '12px',
                  transition: 'all 0.15s ease',
                },
                onFocus: (e) => {
                  e.currentTarget.style.borderColor = 'var(--dsw-alias-state-business-primary)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)'
                },
                onBlur: (e) => {
                  e.currentTarget.style.borderColor = 'var(--dsw-alias-border-l2)'
                  e.currentTarget.style.boxShadow = 'none'
                },
                onChange: (event) => {
                  const next = [...draft]
                  next[index] = event.target.value
                  setDraft(next)
                },
              }),
              h('button', { 
                type: 'button', 
                style: { 
                  ...button, 
                  padding: '4px 10px', 
                  fontSize: '12px',
                  color: 'var(--dsw-alias-state-error-primary)',
                  background: 'transparent',
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent)'
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = 'transparent'
                },
                onClick: () => setDraft(draft.filter((_, i) => i !== index)) 
              }, '×'),
            )),
            h('div', { style: { display: 'flex', gap: '8px', marginTop: '4px' } },
              h('button', { 
                type: 'button', 
                style: { 
                  ...button, 
                  padding: '4px 12px', 
                  fontSize: '12px',
                  background: 'var(--dsw-alias-bg-layer-3)',
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'
                  e.currentTarget.style.color = 'white'
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = 'var(--dsw-alias-bg-layer-3)'
                  e.currentTarget.style.color = 'var(--dsw-alias-label-primary)'
                },
                onClick: () => setDraft([...draft, '']) 
              }, t('panel.add')),
              h('button', { 
                type: 'button', 
                style: { 
                  ...button, 
                  padding: '4px 12px', 
                  fontSize: '12px',
                  background: 'var(--dsw-alias-state-success-primary)',
                  color: 'white',
                  borderColor: 'var(--dsw-alias-state-success-primary)',
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-success-primary) 85%, black 15%)'
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = 'var(--dsw-alias-state-success-primary)'
                },
                onClick: () => void saveLedger() 
              }, t('panel.saveLedger')),
            ),
          )
          : (ledger.length === 0
            ? h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
              h('span', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px', lineHeight: '18px' } }, t('panel.ledgerEmpty')),
              typeof extract === 'function' ? h('button', {
                type: 'button',
                disabled: extracting,
                style: {
                  ...button,
                  padding: 0,
                  fontSize: '11px',
                  lineHeight: '18px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--dsw-alias-state-business-primary)',
                  textDecoration: 'underline',
                },
                onClick: () => void extractLedger(),
              }, extracting ? t('panel.extracting') : t('panel.extract')) : null,
            )
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
              const evidenceReport = sourceId === ''
                ? report
                : (children.find((child) => child.sessionId === sourceId)?.report ?? report)
              const evidence = requirementEvidence(evidenceReport, item)
              const mark = statusMark(status)
              return h('div', { 
                key: `ledger-${index}`, 
                style: { 
                  display: 'flex', 
                  alignItems: 'baseline', 
                  gap: '8px', 
                  fontSize: '13px', 
                  lineHeight: '20px', 
                  color: 'var(--dsw-alias-label-primary)',
                  padding: '6px 0',
                  transition: 'all 0.15s ease',
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.paddingLeft = '4px'
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.paddingLeft = '0'
                },
              },
                h('span', { style: { width: '14px', flex: 'none', color: mark.color, fontWeight: 700, fontSize: '14px' } }, mark.text),
                h('span', { style: { flex: 1 } }, `${index + 1}. ${item}`),
                source === '' ? null : (sourceId !== '' && typeof openSession === 'function'
                  ? h('button', { 
                    type: 'button', 
                    style: { 
                      ...button, 
                      border: 'none', 
                      background: 'transparent', 
                      padding: '2px 6px', 
                      fontSize: '11px', 
                      lineHeight: '16px', 
                      color: 'var(--dsw-alias-label-tertiary)',
                    },
                    onMouseEnter: (e) => {
                      e.currentTarget.style.color = 'var(--dsw-alias-state-business-primary)'
                      e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, transparent)'
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.color = 'var(--dsw-alias-label-tertiary)'
                      e.currentTarget.style.background = 'transparent'
                    },
                    onClick: () => openSession({ sessions: [sourceId] }) 
                  }, `· ${source}`)
                  : h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)' } }, `· ${source}`)),
                evidence !== null && (evidence.tools.length > 0 || evidence.files.length > 0)
                  ? h('span', { style: { fontSize: '10px', color: 'var(--dsw-alias-label-quaternary)', whiteSpace: 'nowrap' } },
                    `${evidence.tools.length} 工具 · ${evidence.files.length} 文件`)
                  : null,
                verifications[item] !== undefined
                  ? h('span', {
                    title: textOf(verifications[item].output),
                    style: {
                      fontSize: '10px',
                      color: verifications[item].ok ? 'var(--dsw-alias-state-success-primary)' : 'var(--dsw-alias-state-error-primary)',
                      whiteSpace: 'nowrap',
                    },
                  }, verifications[item].ok ? `✓ ${t('panel.verifyPass')}` : `× ${t('panel.verifyFail')}`)
                  : null,
                h('button', {
                  type: 'button',
                  style: { ...button, flex: 'none', padding: '1px 6px', fontSize: '10px', lineHeight: '15px', background: 'transparent' },
                  onClick: () => {
                    setVerifyFor(item)
                    setVerifyCommand(verifications[item]?.command ?? 'npm test')
                  },
                }, t('panel.verify')),
              )
            })),
            verifyFor !== '' ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px', padding: '8px', borderRadius: '8px', background: 'var(--dsw-alias-bg-layer-3)' } },
              h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)' } }, `${t('panel.verifyCommand')} · ${verifyFor}`),
              h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center' } },
                h('input', {
                  value: verifyCommand,
                  placeholder: 'npm test',
                  style: { flex: 1, minWidth: 0, borderRadius: '6px', border: '.5px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-1)', color: 'var(--dsw-alias-label-primary)', padding: '4px 7px', fontSize: '11px', fontFamily: 'var(--ds-font-family-code)' },
                  onChange: (event) => setVerifyCommand(event.target.value),
                }),
                h('button', { type: 'button', disabled: verifying, style: { ...button, padding: '2px 8px', fontSize: '11px' }, onClick: () => void runVerification() }, verifying ? t('panel.verifying') : t('panel.verifyRun')),
                h('button', { type: 'button', style: { ...button, padding: '2px 8px', fontSize: '11px' }, onClick: () => setVerifyFor('') }, t('panel.verifyCancel')),
              ),
            ) : null,
        ) : null,
        children.length > 0 ? h('div', {
          ref: childBoxRef,
          className: 'reqtrace-children',
          style: { 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            padding: '12px 14px', 
            borderRadius: '10px', 
            background: 'var(--dsw-alias-bg-layer-2)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.02)',
          },
        },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          h('button', {
            type: 'button',
            style: { 
              ...button, 
              padding: '3px 10px', 
              fontSize: '11px', 
              lineHeight: '16px',
              background: showChildren ? 'var(--dsw-alias-state-business-primary)' : 'var(--dsw-alias-bg-layer-3)',
              color: showChildren ? 'white' : 'var(--dsw-alias-label-primary)',
              borderColor: showChildren ? 'var(--dsw-alias-state-business-primary)' : 'var(--dsw-alias-border-l2)',
              fontWeight: 600,
            },
            onMouseEnter: (e) => {
              if (showChildren) {
                e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 85%, black 15%)'
              } else {
                e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'
                e.currentTarget.style.color = 'white'
              }
            },
            onMouseLeave: (e) => {
              if (showChildren) {
                e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'
                e.currentTarget.style.color = 'white'
              } else {
                e.currentTarget.style.background = 'var(--dsw-alias-bg-layer-3)'
                e.currentTarget.style.color = 'var(--dsw-alias-label-primary)'
              }
            },
            onClick: () => setShowChildren((value) => !value),
          }, `${t('panel.children')} (${children.length})`),
          showChildren ? h('button', {
            type: 'button',
            title: '重播喜鹊飞行',
            'aria-label': '重播喜鹊飞行',
            style: { 
              ...button, 
              flex: 'none', 
              padding: '3px 8px', 
              fontSize: '11px', 
              lineHeight: '16px',
              background: 'transparent',
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = 'var(--dsw-alias-bg-layer-3)'
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = 'transparent'
            },
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
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            paddingLeft: `${32 + Math.max(0, Number(child.delegationDepth ?? 1) - 1) * 12}px`,
            paddingTop: '6px',
            paddingBottom: '6px',
            borderRadius: '8px',
            transition: 'all 0.15s ease',
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = 'var(--dsw-alias-bg-layer-3)'
            e.currentTarget.style.paddingLeft = `${36 + Math.max(0, Number(child.delegationDepth ?? 1) - 1) * 12}px`
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.paddingLeft = `${32 + Math.max(0, Number(child.delegationDepth ?? 1) - 1) * 12}px`
          },
        },
        h('span', { style: { flex: 1, minWidth: 0, fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, `${child.delegationDepth > 1 ? '↳ ' : ''}${child.title ?? child.sessionId} · ${(child.requirements ?? []).length} 条${child.report?.verdict === undefined ? '' : ` · ${child.report.verdict}`}`),
        typeof openSession === 'function' ? h('button', {
          type: 'button',
          style: { 
            ...button, 
            flex: 'none', 
            padding: '2px 8px', 
            fontSize: '11px', 
            lineHeight: '16px',
            background: 'var(--dsw-alias-state-business-primary)',
            color: 'white',
            borderColor: 'var(--dsw-alias-state-business-primary)',
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 85%, black 15%)'
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'
          },
          onClick: () => openSession({ sessions: [child.sessionId] }),
        }, t('panel.openSession')) : null,
        )) : []),
        ) : null,
        globalHistory.length > 0 ? h('div', {
          style: { 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px', 
            padding: '12px 14px', 
            borderRadius: '10px', 
            background: 'var(--dsw-alias-bg-layer-2)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.02)',
          },
        },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
          h('button', {
            type: 'button',
            style: { 
              ...button, 
              flex: 1, 
              textAlign: 'left', 
              padding: '3px 10px', 
              fontSize: '11px', 
              lineHeight: '16px',
              background: showHistory ? 'var(--dsw-alias-state-business-primary)' : 'var(--dsw-alias-bg-layer-3)',
              color: showHistory ? 'white' : 'var(--dsw-alias-label-primary)',
              borderColor: showHistory ? 'var(--dsw-alias-state-business-primary)' : 'var(--dsw-alias-border-l2)',
              fontWeight: 600,
            },
            onMouseEnter: (e) => {
              if (showHistory) {
                e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 85%, black 15%)'
              } else {
                e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'
                e.currentTarget.style.color = 'white'
              }
            },
            onMouseLeave: (e) => {
              if (showHistory) {
                e.currentTarget.style.background = 'var(--dsw-alias-state-business-primary)'
                e.currentTarget.style.color = 'white'
              } else {
                e.currentTarget.style.background = 'var(--dsw-alias-bg-layer-3)'
                e.currentTarget.style.color = 'var(--dsw-alias-label-primary)'
              }
            },
            onClick: () => setShowHistory((value) => !value),
          }, `${t('panel.history')} (${globalHistory.length})`),
          notice !== '' ? h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-state-success-primary)', fontWeight: 500 } }, notice) : null,
        ),
        showHistory ? globalHistory.map((item, index) => {
          const requirements = item.requirements ?? []
          const historyKey = String(item.id ?? `${item.sessionId}:${item.at ?? ''}`)
          const expanded = expandedHistory === historyKey
          return h('div', {
            key: `history-task-${index}`,
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              padding: '8px 10px',
              borderTop: index === 0 ? 'none' : '.5px solid var(--dsw-alias-border-l2)',
              borderRadius: '8px',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = 'var(--dsw-alias-bg-layer-3)'
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = expanded ? 'var(--dsw-alias-bg-layer-2)' : 'transparent'
            },
            onClick: () => setExpandedHistory(expanded ? '' : historyKey),
          },
          h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '8px' } },
            h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' } },
              h('span', { style: { fontSize: '12px', color: 'var(--dsw-alias-label-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 } }, `${index + 1}. ${item.subagent || item.parentSessionId ? '↳ ' : ''}${item.title ?? item.sessionId} · ${requirements.length} 条${formatTime(item.at) === '' ? '' : ` · ${formatTime(item.at)}`}`),
              h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, requirements.slice(0, 2).join(' / ')),
            ),
            h('span', { style: { flex: 'none', fontSize: '14px', color: 'var(--dsw-alias-label-tertiary)', padding: '0 2px' } }, expanded ? '▾' : '▸'),
          ),
          expanded ? h('div', {
            style: { display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '6px', paddingTop: '8px', borderTop: '.5px solid var(--dsw-alias-border-l2)' },
            onClick: (event) => event.stopPropagation(),
          },
          typeof item.report?.verdict === 'string' && item.report.verdict !== ''
            ? h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)' } }, textOf(item.report.verdict))
            : null,
          requirements.length === 0
            ? h('span', { style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)' } }, t('panel.ledgerEmpty'))
            : requirements.map((requirement, requirementIndex) => {
              const found = requirementEntry(item.report, requirement)
              const mark = statusMark(found?.status ?? '')
              const detail = found?.status === 'missing'
                ? found.item?.why
                : found?.status === 'partial'
                  ? found?.item?.missing
                  : found?.status === 'done'
                    ? found?.item?.evidence
                    : ''
              return h('div', { key: `history-requirement-${requirementIndex}`, style: { display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px', lineHeight: '19px', padding: '4px 0' } },
                h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '7px' } },
                  h('span', { style: { width: '12px', flex: 'none', color: mark.color, fontWeight: 700 } }, mark.text),
                  h('span', { style: { flex: 1, minWidth: 0, color: 'var(--dsw-alias-label-primary)' } }, `${requirementIndex + 1}. ${textOf(requirement)}`),
                ),
                detail !== undefined && detail !== '' ? h('div', { style: { paddingLeft: '19px', fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)', lineHeight: '17px' } }, textOf(detail)) : null,
                found?.item?.tools?.length ? h('div', { style: { paddingLeft: '19px', fontSize: '11px', color: 'var(--dsw-alias-label-secondary)' } }, `工具：${found.item.tools.map(textOf).join(' · ')}`) : null,
                found?.item?.files?.length ? h('div', { style: { paddingLeft: '19px', fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)', fontFamily: 'var(--ds-font-family-code)', overflowWrap: 'anywhere' } }, `文件：${found.item.files.map(textOf).join(' · ')}`) : null,
                found?.item?.commands?.length ? h('div', { style: { paddingLeft: '19px', fontSize: '11px', color: 'var(--dsw-alias-label-secondary)', fontFamily: 'var(--ds-font-family-code)', overflowWrap: 'anywhere' } }, `命令：${found.item.commands.map(textOf).join(' · ')}`) : null,
              )
            }),
          asList(item.report?.next).length > 0 ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px', paddingTop: '6px', borderTop: '.5px solid var(--dsw-alias-border-l2)' } },
            h('span', { style: { fontSize: '11px', fontWeight: 600, color: 'var(--dsw-alias-label-secondary)' } }, t('panel.next')),
            ...asList(item.report.next).map((next, nextIndex) => h('div', { key: `history-next-${nextIndex}`, style: { display: 'flex', flexDirection: 'column', gap: '1px', fontSize: '11px', lineHeight: '17px' } },
              h('span', { style: { color: 'var(--dsw-alias-label-primary)' } }, `${nextIndex + 1}. ${textOf(next?.action)}`),
              next?.why ? h('span', { style: { color: 'var(--dsw-alias-label-tertiary)' } }, textOf(next.why)) : null,
            )),
          ) : null,
          asList(item.report?.extra).length > 0 ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' } },
            h('span', { style: { fontSize: '11px', fontWeight: 600, color: 'var(--dsw-alias-label-secondary)' } }, t('panel.extra')),
            ...asList(item.report.extra).map((extra, extraIndex) => h('span', { key: `history-extra-${extraIndex}`, style: { fontSize: '11px', color: 'var(--dsw-alias-label-tertiary)' } }, `- ${textOf(extra)}`)),
          ) : null,
          h('div', { style: { display: 'flex', gap: '8px', marginTop: '6px' } },
            h('button', {
              type: 'button',
              style: { ...button, padding: '4px 10px', fontSize: '11px', background: 'var(--dsw-alias-state-success-primary)', color: 'white', borderColor: 'var(--dsw-alias-state-success-primary)' },
              onClick: () => void resumeTask(index + 1),
            }, t('panel.resumeTask')),
          ),
          ) : null,
          )
        }) : null,
        ) : null,
        h('div', { ref: reportBoxRef, style: { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 } },
          report !== null
            ? h(ReportView, { t, report, openSession, onFix: fix })
            : h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px' } }, busy ? t('panel.running') : t('panel.empty')),
        ),
      )
    }

    class PanelBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }

      static getDerivedStateFromError(error) {
        return { error }
      }

      componentDidCatch(error, info) {
        console.error('[reqtrace] panel failed', error, info)
      }

      render() {
        if (this.state.error !== null) {
          const detail = String(this.state.error?.stack ?? this.state.error)
          return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', overflow: 'auto', fontSize: '11px', color: 'var(--dsw-alias-label-secondary)' } },
            h('strong', { style: { color: 'var(--dsw-alias-state-error-primary)' } }, '需求对账面板渲染失败'),
            h('pre', { style: { margin: 0, whiteSpace: 'pre-wrap', font: '10px/1.45 var(--ds-font-family-code, monospace)' } }, detail.slice(0, 4000)),
            h('button', {
              type: 'button',
              style: { alignSelf: 'flex-start', padding: '3px 8px', fontSize: '11px', border: '1px solid var(--dsw-alias-border-l1)', borderRadius: '6px', background: 'transparent', color: 'inherit', cursor: 'pointer' },
              onClick: () => this.setState({ error: null }),
            }, '重试'),
          )
        }
        return this.props.children
      }
    }

    function SafeAuditPanel(props) {
      return h(PanelBoundary, null, h(AuditPanel, props))
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
      const row = { display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', padding: '8px 0' }
      return h('div', { style: { ...card, maxWidth: '760px' } },
        h('div', { style: header },
          h('div', {
            style: {
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              display: 'grid',
              placeItems: 'center', 
              flex: 'none', 
              color: 'var(--dsw-alias-state-business-primary)',
              background: 'color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)',
              boxShadow: '0 2px 4px rgba(0,0,0,.04)',
            },
          }, h(Icon, { size: 20 })),
          h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' } },
            h('strong', { style: { fontSize: '16px', lineHeight: '24px', fontWeight: 600 } }, t('settings.title')),
            h('span', { style: { fontSize: '12px', lineHeight: '18px', color: 'var(--dsw-alias-label-tertiary)' } }, t('settings.description')),
          ),
        ),
        h('div', { style: { height: '.5px', background: 'var(--dsw-alias-border-l2)', margin: '4px 0' } }),
        h('label', { style: row },
          h('span', { style: { fontSize: '14px', fontWeight: 500 } }, t('settings.autoAudit')),
          h('input', {
            type: 'checkbox',
            checked: config.autoAudit === true,
            style: { width: '18px', height: '18px', cursor: 'pointer' },
            onChange: (event) => setConfig({ ...config, autoAudit: event.target.checked }),
          }),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px', lineHeight: '18px', marginTop: '-6px', paddingLeft: '4px' } }, t('settings.autoAuditHint')),
        h('label', { style: row },
          h('span', { style: { fontSize: '14px', fontWeight: 500 } }, t('settings.autoExtract')),
          h('input', {
            type: 'checkbox',
            checked: config.autoExtract === true,
            style: { width: '18px', height: '18px', cursor: 'pointer' },
            onChange: (event) => setConfig({ ...config, autoExtract: event.target.checked }),
          }),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px', lineHeight: '18px', marginTop: '-6px', paddingLeft: '4px' } }, t('settings.autoExtractHint')),
        h('label', { style: row },
          h('span', { style: { fontSize: '14px', fontWeight: 500 } }, t('settings.strict')),
          h('input', {
            type: 'checkbox',
            checked: config.strict === true,
            style: { width: '18px', height: '18px', cursor: 'pointer' },
            onChange: (event) => setConfig({ ...config, strict: event.target.checked }),
          }),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px', lineHeight: '18px', marginTop: '-6px', paddingLeft: '4px' } }, t('settings.strictHint')),
        h('label', { style: row },
          h('span', { style: { fontSize: '14px', fontWeight: 500 } }, t('settings.auditMode')),
          h('select', {
            value: config.auditMode ?? 'direct',
            style: { borderRadius: '8px', border: '.5px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)', padding: '6px 10px', fontSize: '13px' },
            onChange: (event) => setConfig({ ...config, auditMode: event.target.value }),
          },
          h('option', { value: 'direct' }, t('settings.auditDirect')),
          h('option', { value: 'subagent' }, t('settings.auditSubagent')),
          ),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px', lineHeight: '18px', marginTop: '-6px', paddingLeft: '4px' } }, t('settings.auditModeHint')),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '11px', lineHeight: '17px', marginTop: '4px', padding: '8px 12px', borderRadius: '8px', background: 'var(--dsw-alias-bg-layer-2)' } }, t('settings.costHint')),
        h('label', { style: row },
          h('span', { style: { fontSize: '14px', fontWeight: 500 } }, t('settings.minToolCalls')),
          h('input', {
            type: 'number',
            min: 1,
            max: 20,
            value: config.minToolCalls,
            style: { 
              width: '80px', 
              borderRadius: '8px', 
              border: '.5px solid var(--dsw-alias-border-l2)', 
              background: 'var(--dsw-alias-bg-layer-2)', 
              color: 'var(--dsw-alias-label-primary)', 
              padding: '6px 10px', 
              fontSize: '13px',
              transition: 'all 0.15s ease',
            },
            onFocus: (e) => {
              e.currentTarget.style.borderColor = 'var(--dsw-alias-state-business-primary)'
              e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent)'
            },
            onBlur: (e) => {
              e.currentTarget.style.borderColor = 'var(--dsw-alias-border-l2)'
              e.currentTarget.style.boxShadow = 'none'
            },
            onChange: (event) => setConfig({ ...config, minToolCalls: Number(event.target.value) }),
          }),
        ),
        h('div', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '12px', lineHeight: '18px', marginTop: '-6px', paddingLeft: '4px' } }, t('settings.minToolCallsHint')),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px' } },
          h('button', { 
            style: { 
              ...button, 
              padding: '6px 16px', 
              fontSize: '13px',
              background: saving ? 'var(--dsw-alias-bg-layer-2)' : 'var(--dsw-alias-state-success-primary)',
              color: saving ? 'var(--dsw-alias-label-primary)' : 'white',
              borderColor: saving ? 'var(--dsw-alias-border-l2)' : 'var(--dsw-alias-state-success-primary)',
            },
            disabled: saving, 
            onMouseEnter: (e) => {
              if (!saving) {
                e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-success-primary) 85%, black 15%)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            },
            onMouseLeave: (e) => {
              if (!saving) {
                e.currentTarget.style.background = 'var(--dsw-alias-state-success-primary)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            },
            onClick: () => void save() 
          }, saving ? t('settings.saving') : t('settings.save')),
          saved ? h('span', { style: { color: 'var(--dsw-alias-state-success-primary)', fontSize: '13px', fontWeight: 500 } }, t('settings.saved')) : null,
          error ? h('span', { style: { color: 'var(--dsw-alias-state-error-primary)', fontSize: '13px' } }, error) : null,
        ),
        h('div', { style: { height: '.5px', background: 'var(--dsw-alias-border-l2)', margin: '8px 0' } }),
        h('strong', { style: { fontSize: '14px', lineHeight: '22px', fontWeight: 600 } }, t('settings.history')),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflow: 'auto' } },
          history.length === 0
            ? h('span', { style: { color: 'var(--dsw-alias-label-tertiary)', fontSize: '13px' } }, t('settings.historyEmpty'))
            : history.map((ledger) => {
              const expanded = expandedHistory === ledger.sessionId
              const requirements = ledger.requirements ?? []
              return h('div', {
                key: ledger.sessionId,
                style: { 
                  padding: '10px 12px', 
                  borderRadius: '10px', 
                  background: 'var(--dsw-alias-bg-layer-2)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '6px', 
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: '.5px solid transparent',
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-bg-layer-2) 95%, var(--dsw-alias-state-business-primary) 5%)'
                  e.currentTarget.style.borderColor = 'var(--dsw-alias-border-l2)'
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = 'var(--dsw-alias-bg-layer-2)'
                  e.currentTarget.style.borderColor = 'transparent'
                },
                onClick: () => setExpandedHistory(expanded ? '' : ledger.sessionId),
              },
              h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                h('span', { style: { flex: 1, minWidth: 0, fontSize: '13px', color: 'var(--dsw-alias-label-primary)', fontWeight: 500 } }, `${ledger.subagent || ledger.parentSessionId ? '↳ ' : ''}${ledger.title ?? ledger.sessionId} · ${requirements.length} 条${formatTime(ledger.at) === '' ? '' : ` · ${formatTime(ledger.at)}`}`),
                h('button', {
                  type: 'button',
                  style: { 
                    ...button, 
                    flex: 'none', 
                    padding: '2px 8px', 
                    fontSize: '11px', 
                    lineHeight: '16px',
                    background: 'transparent',
                    color: confirmClearId === ledger.id ? 'var(--dsw-alias-state-error-primary)' : 'var(--dsw-alias-label-tertiary)',
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.background = confirmClearId === ledger.id ? 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent)' : 'var(--dsw-alias-bg-layer-3)'
                    e.currentTarget.style.color = confirmClearId === ledger.id ? 'var(--dsw-alias-state-error-primary)' : 'var(--dsw-alias-label-primary)'
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = confirmClearId === ledger.id ? 'var(--dsw-alias-state-error-primary)' : 'var(--dsw-alias-label-tertiary)'
                  },
                  onClick: (event) => {
                    event.stopPropagation()
                    void clearOne(ledger)
                  },
                }, confirmClearId === ledger.id ? t('settings.confirmClearOne') : t('settings.clearOne')),
              ),
              h('span', { style: { fontSize: '12px', color: 'var(--dsw-alias-label-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, requirements.slice(0, 2).join(' / ')),
              expanded ? h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px', paddingTop: '6px', borderTop: '.5px solid var(--dsw-alias-border-l2)' } },
                ...requirements.map((item, index) => h('span', { key: `history-${index}`, style: { fontSize: '12px', color: 'var(--dsw-alias-label-secondary)' } }, `${index + 1}. ${item}`)),
              ) : null,
              )
            }),
        ),
        h('button', {
          type: 'button',
          style: {
            ...button,
            alignSelf: 'flex-start',
            padding: '5px 12px',
            fontSize: '12px',
            marginTop: '4px',
            color: confirmClear ? 'white' : 'var(--dsw-alias-label-tertiary)',
            background: confirmClear ? 'var(--dsw-alias-state-error-primary)' : 'transparent',
            borderColor: confirmClear ? 'var(--dsw-alias-state-error-primary)' : 'var(--dsw-alias-border-l2)',
          },
          onMouseEnter: (e) => {
            if (confirmClear) {
              e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 85%, black 15%)'
            } else {
              e.currentTarget.style.background = 'color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent)'
              e.currentTarget.style.color = 'var(--dsw-alias-state-error-primary)'
            }
          },
          onMouseLeave: (e) => {
            if (confirmClear) {
              e.currentTarget.style.background = 'var(--dsw-alias-state-error-primary)'
              e.currentTarget.style.color = 'white'
            } else {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--dsw-alias-label-tertiary)'
            }
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
            .reqtrace-bird { position: fixed; left: 0; top: 0; width: 40px; height: 40px; z-index: 9999; pointer-events: none; color: #dce6f2; filter: drop-shadow(0 2px 5px rgba(0,0,0,.5)); will-change: transform; }
            .reqtrace-bird svg { display: block; width: 100%; height: 100%; overflow: visible; }
            .reqtrace-bird .wing { transform-box: view-box; transform-origin: 30px 19.8px; animation: reqtrace-wing .16s ease-in-out infinite alternate; }
            .reqtrace-bird .tail { transform-box: view-box; transform-origin: 14px 22px; animation: reqtrace-tail .9s cubic-bezier(.3, 0, .3, 1); }
            @keyframes reqtrace-wing { from { transform: rotate(-22deg); } to { transform: rotate(18deg); } }
            @keyframes reqtrace-tail { 0%, 100% { transform: none; } 18% { transform: rotate(16deg); } 36% { transform: rotate(-7deg); } 54% { transform: rotate(9deg); } 72% { transform: rotate(-3deg); } 86% { transform: rotate(2deg); } }
            @media (prefers-reduced-motion: reduce) { .reqtrace-bird .wing, .reqtrace-bird .tail { animation: none; } }
            .reqtrace-landing-ring { position: fixed; z-index: 9998; width: 44px; height: 44px; margin: -22px 0 0 -22px; border: 1px solid #62a8ff; border-radius: 50%; pointer-events: none; opacity: .8; transform: scale(.2); animation: reqtrace-landing .55s ease-out forwards; }
            @keyframes reqtrace-landing { to { transform: scale(1); opacity: 0; } }
          `
          doc.head.append(style)
          return () => style.remove()
        }, 'reqtrace: flight styles')
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
              fix: () => ctx.remote.commands.execute(sessionId, '/reqtrace fix', []),
              extract: () => ctx.remote.commands.execute(sessionId, '/reqtrace extract', []),
              openSession: (item) => {
                const childSessionId = Array.isArray(item?.sessions) ? item.sessions[0] : undefined
                const workspace = ctx.get?.('uiWorkspace')
                if (childSessionId !== undefined && typeof workspace?.openSession === 'function') {
                  workspace.openSession({ parentSessionId: sessionId, childSessionId, mode: 'unknown' })
                }
              },
            }
          },
        }, SafeAuditPanel))
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
