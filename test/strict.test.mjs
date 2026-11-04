import test from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../index.js'

test('strict mode steers once when the audit finds a missing requirement', async () => {
  const listeners = new Map()
  let steered
  const entry = { id: 'reqtrace-row' }
  const ctx = {
    fiber: { entry },
    effect(fn) { fn() },
    on(name, listener) { listeners.set(name, listener); return () => {} },
    get(key) {
      if (key === 'configEditor') {
        return { configuration: () => [{ entry, override: { strict: true, autoAudit: false, autoExtract: false, minToolCalls: 2 } }] }
      }
      if (key === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'test', model: 'test' }) }
      if (key === 'llm') return {
        prepareCall: async () => ({
          config: {},
          async *stream() {
            yield { type: 'text-delta', text: '{"verdict":"1 missing","next":[],"missing":[{"requirement":"Keep old API","why":"no edit"}],"partial":[],"done":[],"extra":[]}' }
          },
        }),
      }
      return undefined
    },
    inject(deps, fn) {
      if (deps.includes('connection')) {
        fn({ connection: { fetch: { register: () => {} } }, sessions: { get: () => undefined } })
      }
    },
  }
  apply(ctx)
  const stopping = listeners.get('agent/turn-stopping')
  const session = {
    id: 's1',
    seq: 2,
    snapshotEvents: () => [
      { type: 'user/message', data: { content: [{ type: 'text', text: 'Keep old API' }] } },
      { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'Done' }] } } },
    ],
  }
  const agent = { session, steer: (message) => { steered = message } }
  await stopping({ agent, turn: 1 })
  assert.ok(steered)
  assert.match(steered.content[0].text, /需求对账/)
  assert.match(steered.content[0].text, /Keep old API/)
  await stopping({ agent, turn: 1 })
  assert.equal(steered.content[0].text.includes('Keep old API'), true)
})
