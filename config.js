export const DEFAULT_CONFIG = {
  autoAudit: false,
  autoExtract: false,
  strict: false,
  minToolCalls: 2,
  auditMode: 'direct',
}

const clamp = (value, min, max, fallback) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, Math.round(number)))
}

/** Keep only values the Host knows how to use. */
export function sanitizeConfig(raw) {
  const input = raw !== null && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const config = { ...DEFAULT_CONFIG }
  if (typeof input.autoAudit === 'boolean') config.autoAudit = input.autoAudit
  if (typeof input.autoExtract === 'boolean') config.autoExtract = input.autoExtract
  if (typeof input.strict === 'boolean') config.strict = input.strict
  if (input.auditMode === 'subagent' || input.auditMode === 'direct') config.auditMode = input.auditMode
  config.minToolCalls = clamp(input.minToolCalls, 1, 20, config.minToolCalls)
  return config
}

/** Read the plugin row config through DSH's config editor. */
export function readConfig(ctx, fallback = DEFAULT_CONFIG) {
  try {
    const editor = ctx?.get?.('configEditor')
    const entry = ctx?.fiber?.entry
    if (editor === undefined || entry === undefined) return sanitizeConfig(fallback)
    const row = editor.configuration().find((each) => each.entry === entry)
    return sanitizeConfig(row?.override ?? row?.inherited ?? fallback)
  } catch {
    return sanitizeConfig(fallback)
  }
}

/** Write the plugin row config through DSH's config editor. */
export async function writeConfig(ctx, next) {
  const editor = ctx?.get?.('configEditor')
  const entry = ctx?.fiber?.entry
  if (editor === undefined || entry === undefined) throw new Error('configuration is not editable here')
  const merged = { ...readConfig(ctx, DEFAULT_CONFIG), ...next }
  const config = sanitizeConfig(merged)
  await editor.edit(entry, () => config)
  return config
}
