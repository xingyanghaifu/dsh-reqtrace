import test from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../index.js'

function createContext() {
  const commands = []
  const ctx = {
    effect(fn) { fn() },
    on() { return () => {} },
    inject(deps, fn) {
      if (deps.includes('commands')) fn({ commands: { register: (command) => commands.push(command) } })
    },
    get(key) {
      if (key === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'test', model: 'test' }) }
      if (key === 'llm') return undefined
      return undefined
    },
  }
  return { ctx, commands }
}

test('registers the /reqtrace command', () => {
  const { ctx, commands } = createContext()
  apply(ctx)
  assert.equal(commands.length, 1)
  assert.equal(commands[0].name, 'reqtrace')
})

test('command returns a report through the configured model', async () => {
  const { ctx, commands } = createContext()
  ctx.get = (key) => {
    if (key === 'agentDefaultModel') return { currentSelection: () => ({ provider: 'test', model: 'test' }) }
    if (key === 'llm') return {
      prepareCall: async () => ({
        config: {},
        async *stream() {
          yield { type: 'text-delta', text: '| # | Requirement |\n| 1 | Export | done |' }
        },
      }),
    }
    return undefined
  }
  apply(ctx)
  const session = {
    snapshotEvents: () => [{
      type: 'user/message',
      data: { content: [{ type: 'text', text: 'Export CSV' }] },
    }],
  }
  const result = await commands[0].handler({ agent: { session }, signal: new AbortController().signal, rawInput: '' })
  assert.equal(result.kind, 'success')
  assert.match(result.text, /Requirement/)
})
