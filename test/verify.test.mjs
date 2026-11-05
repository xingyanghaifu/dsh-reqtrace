import test from 'node:test'
import assert from 'node:assert/strict'
import { executeVerification } from '../index.js'

test('executeVerification runs ops_bash and reports a passing result', async () => {
  const calls = []
  const tools = {
    execute: async (exec) => {
      calls.push(exec)
      return { content: [{ type: 'text', text: 'all tests passed' }] }
    },
  }
  const result = await executeVerification(tools, 'npm test', new AbortController().signal)
  assert.equal(result.passed, true)
  assert.equal(result.output, 'all tests passed')
  assert.equal(calls[0].name, 'ops_bash')
  assert.equal(calls[0].arguments.command, 'npm test')
})

test('executeVerification reports a failed result', async () => {
  const tools = {
    execute: async () => ({ ok: false, content: [{ type: 'text', text: '1 failed' }] }),
  }
  const result = await executeVerification(tools, 'npm test')
  assert.equal(result.passed, false)
  assert.equal(result.output, '1 failed')
})

test('executeVerification refuses without the tools service', async () => {
  await assert.rejects(() => executeVerification(undefined, 'npm test'), /tools service/)
})
