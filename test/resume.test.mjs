import test from 'node:test'
import assert from 'node:assert/strict'
import { formatResumeMessage } from '../index.js'

test('formatResumeMessage carries requirement statuses into a new task', () => {
  const message = formatResumeMessage({
    sessionId: 's1',
    title: 'Export task',
    request: 'Add CSV export and keep the old API.',
    requirements: ['Export CSV', 'Keep old API', 'Chinese errors'],
    report: {
      done: [{ requirement: 'Export CSV', evidence: 'src/export.ts' }],
      partial: [{ requirement: 'Keep old API', missing: 'old field removed' }],
      missing: [{ requirement: 'Chinese errors', why: 'no edit' }],
    },
  })
  assert.match(message, /\[需求续接\]/)
  assert.match(message, /原始请求：/)
  assert.match(message, /Add CSV export/)
  assert.match(message, /\[已完成\] Export CSV/)
  assert.match(message, /\[部分完成\] Keep old API/)
  assert.match(message, /\[缺失\] Chinese errors/)
  assert.match(message, /继续完成所有/)
})
