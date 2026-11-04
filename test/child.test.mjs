import test from 'node:test'
import assert from 'node:assert/strict'
import { auditSession } from '../audit.js'

test('auditSession loads archived child evidence through sessionQuery', async () => {
  let prompt = ''
  const childEvents = [{
    type: 'tool/call',
    data: { callId: 'c1', name: 'write', arguments: '{"file_path":"src/child.ts","content":"child"}' },
  }]
  const ctx = {
    get(key) {
      if (key === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'test', model: 'test' }) }
      if (key === 'llm') return {
        prepareCall: async () => ({
          config: {},
          async *stream(request) {
            prompt = request.messages[0].content[0].text
            yield { type: 'text-delta', text: '{"verdict":"0 done, 0 partial, 0 missing, 0 extra","next":[],"missing":[],"partial":[],"done":[],"extra":[]}' }
          },
        }),
      }
      if (key === 'sessionQuery') return {
        filterSessions: async () => [{ header: { id: 'child-1', parentSession: 'parent-1', origin: 'subagent' } }],
        readSession: async () => ({ events: childEvents }),
        readTitle: async () => 'Child worker',
      }
      return undefined
    },
  }
  const parent = {
    id: 'parent-1',
    seq: 1,
    snapshotEvents: () => [{ type: 'user/message', data: { content: [{ type: 'text', text: 'Do the parent task' }] } }],
  }
  const report = await auditSession(ctx, parent, new AbortController().signal, { requirements: [] })
  assert.equal(typeof report, 'object')
  assert.match(prompt, /SUBAGENT EVIDENCE/)
  assert.match(prompt, /Child worker/)
  assert.match(prompt, /src\/child\.ts/)
})
