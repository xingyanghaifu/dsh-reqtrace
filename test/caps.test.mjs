import test from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../index.js'

function createHarness() {
  const listeners = new Map()
  const routes = new Map()
  const entry = { id: 'reqtrace-row' }
  const ctx = {
    fiber: { entry },
    effect(fn) { fn() },
    on(name, listener) { listeners.set(name, listener); return () => {} },
    get(key) {
      if (key === 'configEditor') {
        return { configuration: () => [{ entry, override: { autoExtract: true, autoAudit: false, strict: false, minToolCalls: 2 } }] }
      }
      if (key === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'test', model: 'test' }) }
      if (key === 'llm') {
        return {
          prepareCall: async () => ({
            config: {},
            async *stream() {
              yield { type: 'text-delta', text: '{"requirements":["requirement"]}' }
              yield { type: 'usage', usage: { inputTokens: 1, outputTokens: 1 } }
            },
          }),
        }
      }
      return undefined
    },
    inject(deps, fn) {
      if (deps.includes('connection')) {
        fn({
          connection: { fetch: { register: (route) => { routes.set(route.path, route.fetch) } } },
          sessions: { get: () => undefined },
        })
      }
    },
  }
  return { ctx, listeners, routes }
}

test('task ledgers stay bounded and disposed sessions lose ephemeral state', async () => {
  const { ctx, listeners, routes } = createHarness()
  apply(ctx)
  const event = listeners.get('session/event')
  for (let i = 0; i < 205; i += 1) {
    event({ id: `cap-session-${i}`, title: `task ${i}` }, {
      type: 'user/message',
      seq: i,
      data: { content: [{ type: 'text', text: `requirement for task ${i}` }] },
    })
  }
  await new Promise((resolve) => setTimeout(resolve, 200))
  const response = await routes.get('/api/reqtrace.ledgers')({ url: 'http://local/api/reqtrace.ledgers?limit=200', method: 'GET' })
  const body = await response.json()
  assert.ok(body.ledgers.length <= 200)
  assert.ok(body.ledgers.length >= 190, `ledger count ${body.ledgers.length}`)

  const session = { id: 'dispose-session', title: 'dispose' }
  event(session, { type: 'turn/start', data: { turn: 1 } })
  event(session, { type: 'tool/call', data: { callId: 'a' } })
  event(session, { type: 'tool/call', data: { callId: 'b' } })
  event(session, { type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } })
  let state = await routes.get('/api/reqtrace.state')({ url: 'http://local/api/reqtrace.state?sessionId=dispose-session', method: 'GET' })
  assert.equal((await state.json()).pending, true)
  listeners.get('session/disposed')(session)
  state = await routes.get('/api/reqtrace.state')({ url: 'http://local/api/reqtrace.state?sessionId=dispose-session', method: 'GET' })
  assert.equal((await state.json()).pending, false)
})
