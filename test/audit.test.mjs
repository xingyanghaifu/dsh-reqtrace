import test from 'node:test'
import assert from 'node:assert/strict'
import { auditSession, buildAuditPrompt, collectEvidence, extractRequirements, findConflicts, formatReport, parseReport, readEvents, readTodos, shouldExtract } from '../audit.js'

const events = [
  {
    type: 'user/message',
    data: { content: [{ type: 'text', text: 'Add CSV export and keep the old API.' }] },
  },
  {
    type: 'tool/call',
    data: { callId: 'c1', name: 'write', arguments: '{"file_path":"src/export.ts"}' },
  },
  {
    type: 'tool/result',
    data: { message: { toolCallId: 'c1', content: [{ type: 'text', text: 'written' }], isError: false } },
  },
  {
    type: 'assistant/message',
    data: { message: { content: [{ type: 'text', text: 'Implemented CSV export.' }] } },
  },
]

test('readTodos returns the latest todo_write list with statuses', () => {
  const result = readTodos([
    { type: 'tool/call', seq: 3, data: { name: 'todo_write', arguments: JSON.stringify({ todos: [
      { content: 'Read the code', status: 'completed' },
      { content: 'Write the fix', status: 'in_progress', activeForm: 'Writing the fix' },
      { content: 'Run tests', status: 'pending' },
    ] }) } },
    { type: 'tool/call', seq: 7, data: { name: 'todo_write', arguments: JSON.stringify({ todos: [
      { content: 'Write the fix', status: 'completed' },
      { content: 'Run tests', status: 'in_progress' },
    ] }) } },
  ])
  assert.equal(result.seq, 7)
  assert.deepEqual(result.todos, [
    { content: 'Write the fix', status: 'completed', activeForm: '' },
    { content: 'Run tests', status: 'in_progress', activeForm: '' },
  ])
})

test('auditSession can delegate the review to a subagent', async () => {
  const events = [{
    type: 'user/message',
    data: { content: [{ type: 'text', text: 'Add CSV export' }] },
  }]
  let started = null
  const ctx = {
    get(key) {
      if (key === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'test', model: 'test' }) }
      if (key === 'subagents') return { start: async (name, request) => { started = { name, request }; return { result: Promise.resolve({ text: JSON.stringify({ verdict: 'done', next: [], missing: [], partial: [], done: [{ requirement: 'Add CSV export', evidence: 'export.ts' }], extra: [] }) }) } } }
      if (key === 'llm') throw new Error('direct llm must not be used in subagent mode')
      return undefined
    },
  }
  const session = { id: 'subagent-audit', seq: 1, snapshotEvents: () => events }
  const report = await auditSession(ctx, session, new AbortController().signal, { auditMode: 'subagent' })
  assert.equal(report.done[0].requirement, 'Add CSV export')
  assert.equal(started.name, 'spawn')
  assert.match(started.request.prompt, /Add CSV export/)
})

test('collectEvidence separates requests, tool calls and final answer', () => {
  const result = collectEvidence(events)
  assert.deepEqual(result.requests, ['Add CSV export and keep the old API.'])
  assert.equal(result.evidence.length, 2)
  assert.equal(result.evidence[0].name, 'write')
  assert.equal(result.evidence[0].target, 'file_path=src/export.ts')
  assert.equal(result.evidence[1].ok, true)
  assert.equal(result.finalAnswer, 'Implemented CSV export.')
})

test('parseReport repairs unescaped quotes inside string values', () => {
  const raw = '```json\n{"verdict":"1 missing","next":[],"missing":[{"requirement":"明确"哪呢？"的上下文","why":"缺少前文"}],"partial":[],"done":[],"extra":[]}\n```'
  const report = parseReport(raw)
  assert.equal(report.missing[0].requirement, '明确"哪呢？"的上下文')
})

test('parseReport accepts the compact JSON contract', () => {
  const report = parseReport('{"verdict":"1 done, 1 missing","next":[{"action":"Verify old API","why":"field was deleted"}],"missing":[{"requirement":"Keep old API","why":"no edit","tools":["read"],"files":["src/routes.ts"]}],"partial":[],"done":[{"requirement":"Export CSV","evidence":"src/export.ts","tools":["write"],"files":["src/export.ts"]}],"extra":["extra auth change"]}')
  assert.equal(report.verdict, '1 done, 1 missing')
  assert.equal(report.next[0].action, 'Verify old API')
  assert.equal(report.missing[0].requirement, 'Keep old API')
  assert.deepEqual(report.missing[0].tools, ['read'])
  assert.deepEqual(report.done[0].files, ['src/export.ts'])
  assert.equal(report.done[0].evidence, 'src/export.ts')
  assert.deepEqual(report.extra, ['extra auth change'])
})

test('formatReport renders a human-readable summary', () => {
  const text = formatReport(parseReport('{"verdict":"1 done","next":[{"action":"Check old API","why":"deleted field"}],"missing":[],"partial":[],"done":[{"requirement":"Export CSV","evidence":"src/export.ts"}],"extra":[]}'))
  assert.match(text, /需求对账：1 done/)
  assert.match(text, /先看这几条/)
  assert.match(text, /✅ Export CSV/)
})

test('shouldExtract skips acknowledgements and commands', () => {
  assert.equal(shouldExtract('继续'), false)
  assert.equal(shouldExtract('可以'), false)
  assert.equal(shouldExtract('/reqtrace'), false)
  assert.equal(shouldExtract('把导出功能改成 CSV 格式'), true)
})

test('extractRequirements parses a short checklist', async () => {
  const ctx = {
    get(key) {
      if (key === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'test', model: 'test' }) }
      if (key === 'llm') return {
        prepareCall: async () => ({
          config: {},
          async *stream() {
            yield { type: 'text-delta', text: '{"requirements":["Export CSV","Keep old API"]}' }
            yield { type: 'usage', usage: { inputTokens: 120, outputTokens: 30 } }
          },
        }),
      }
      return undefined
    },
  }
  const result = await extractRequirements(ctx, 'Export CSV and keep the old API', new AbortController().signal)
  assert.deepEqual(result.requirements, ['Export CSV', 'Keep old API'])
  assert.deepEqual(result.usage, { inputTokens: 120, outputTokens: 30 })
})

test('auditSession keeps provider usage on the report', async () => {
  const ctx = {
    get(key) {
      if (key === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'test', model: 'test' }) }
      if (key === 'llm') return {
        prepareCall: async () => ({
          config: {},
          async *stream() {
            yield { type: 'usage', usage: { inputTokens: 900, outputTokens: 120 } }
            yield { type: 'text-delta', text: '{"verdict":"1 done","next":[],"missing":[],"partial":[],"done":[{"requirement":"Export","evidence":"src/x"}],"extra":[]}' }
          },
        }),
      }
      return undefined
    },
  }
  const session = {
    id: 'usage-session',
    seq: 1,
    snapshotEvents: () => [{ type: 'user/message', data: { content: [{ type: 'text', text: 'Export' }] } }],
  }
  const report = await auditSession(ctx, session, new AbortController().signal, { requirements: [] })
  assert.deepEqual(report.usage, { inputTokens: 900, outputTokens: 120 })
})

test('buildAuditPrompt includes the request and evidence', () => {
  const prompt = buildAuditPrompt(collectEvidence(events))
  assert.match(prompt, /Add CSV export/)
  assert.match(prompt, /CALL write/)
  assert.match(prompt, /RESULT write: ok/)
})

test('buildAuditPrompt puts an explicit checklist first', () => {
  const prompt = buildAuditPrompt(collectEvidence(events), ['Keep old API'])
  assert.match(prompt, /^CHECKLIST/)
  assert.match(prompt, /1\. Keep old API/)
})

test('findConflicts flags different content on the same path', () => {
  const parent = collectEvidence([{
    type: 'tool/call',
    data: { callId: 'p1', name: 'write', arguments: '{"file_path":"src/x.ts","content":"old"}' },
  }])
  const children = [{
    sessionId: 'child-1',
    title: 'Child worker',
    ...collectEvidence([{
      type: 'tool/call',
      data: { callId: 'c1', name: 'write', arguments: '{"file_path":"src/x.ts","content":"new"}' },
    }]),
  }]
  const conflicts = findConflicts(parent, children)
  assert.equal(conflicts.length, 1)
  assert.match(conflicts[0].text, /内容版本不一致/)
})

test('buildAuditPrompt includes conflict warnings', () => {
  const prompt = buildAuditPrompt(collectEvidence(events), [], [], [], ['src/export.ts：当前任务 / Child worker'])
  assert.match(prompt, /POTENTIAL CONFLICTS/)
  assert.match(prompt, /src\/export\.ts/)
})

test('buildAuditPrompt includes subagent evidence and checklists', () => {
  const prompt = buildAuditPrompt(collectEvidence(events), [], [{
    sessionId: 'child-1',
    title: 'Child worker',
    ...collectEvidence(events),
  }], [{
    sessionId: 'child-2',
    title: 'Child ledger',
    requirements: ['Export CSV'],
    report: { done: [{ requirement: 'Export CSV' }] },
  }])
  assert.match(prompt, /SUBAGENT EVIDENCE/)
  assert.match(prompt, /Child worker/)
  assert.match(prompt, /CALL write/)
  assert.match(prompt, /CHILD CHECKLISTS/)
  assert.match(prompt, /\[已完成\] Export CSV/)
})

test('readEvents prefers a session snapshot', () => {
  const session = { snapshotEvents: () => events }
  assert.equal(readEvents(session), events)
})

test('readEvents falls back to eventAt for a live session', () => {
  const session = {
    seq: 2,
    eventAt(index) {
      return events[index]
    },
  }
  assert.deepEqual(readEvents(session), events.slice(0, 2))
})
