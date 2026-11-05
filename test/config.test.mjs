import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_CONFIG, sanitizeConfig } from '../config.js'

test('sanitizeConfig keeps defaults for unknown input', () => {
  assert.deepEqual(sanitizeConfig(null), DEFAULT_CONFIG)
})

test('sanitizeConfig accepts autoAudit and clamps minToolCalls', () => {
  assert.deepEqual(sanitizeConfig({ autoAudit: true, minToolCalls: 99 }), { ...DEFAULT_CONFIG, autoAudit: true, minToolCalls: 20 })
  assert.equal(sanitizeConfig({ auditMode: 'subagent' }).auditMode, 'subagent')
})

test('sanitizeConfig drops invalid values', () => {
  assert.deepEqual(sanitizeConfig({ autoAudit: 'yes', minToolCalls: -1 }), { ...DEFAULT_CONFIG, autoAudit: false, minToolCalls: 1 })
  assert.equal(sanitizeConfig({ auditMode: 'bogus' }).auditMode, 'direct')
})
