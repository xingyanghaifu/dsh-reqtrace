import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_CONFIG, sanitizeConfig } from '../config.js'

test('sanitizeConfig keeps defaults for unknown input', () => {
  assert.deepEqual(sanitizeConfig(null), DEFAULT_CONFIG)
})

test('sanitizeConfig accepts autoAudit and clamps minToolCalls', () => {
  assert.deepEqual(sanitizeConfig({ autoAudit: true, minToolCalls: 99 }), { autoAudit: true, autoExtract: false, strict: false, minToolCalls: 20 })
})

test('sanitizeConfig drops invalid values', () => {
  assert.deepEqual(sanitizeConfig({ autoAudit: 'yes', minToolCalls: -1 }), { autoAudit: false, autoExtract: false, strict: false, minToolCalls: 1 })
})
