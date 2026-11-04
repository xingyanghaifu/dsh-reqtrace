import test from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../index.js'

test('marks a session pending after a turn with at least two tool calls', async () => {
  const listeners = new Map()
  const routes = new Map()
  const ctx = {
    effect(fn) { fn() },
    on(name, listener) { listeners.set(name, listener); return () => {} },
    inject(deps, fn) {
      if (deps.includes('connection')) {
        fn({
          connection: { fetch: { register: (route) => { routes.set(route.path, route.fetch) } } },
          sessions: { get: () => undefined },
        })
      }
    },
  }
  apply(ctx)
  const eventListener = listeners.get('session/event')
  eventListener({ id: 's1' }, { type: 'turn/start', data: { turn: 1 } })
  eventListener({ id: 's1' }, { type: 'tool/call', data: { callId: 'a' } })
  eventListener({ id: 's1' }, { type: 'tool/call', data: { callId: 'b' } })
  eventListener({ id: 's1' }, { type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } })
  const response = await routes.get('/api/reqtrace.state')({ url: 'http://local/api/reqtrace.state?sessionId=s1' })
  const body = await response.json()
  assert.equal(body.pending, true)
  assert.equal(body.turn, 1)
})
