import { capitalize } from '@/lib/utils/string'
import { resolveFieldName } from '@/features/marketplace/lib/field-config'

/**
 * Maps filter on format key=v1,v2 to format server expects key=v1&key=v2
 *
 * @param filters pairs of key values[]
 * @returns URLSearchParams with repeated query keys.
 */
export function toSearchParams(filters: Record<string, string[]>) {
  const params = new URLSearchParams()

  const traits: string[] = []
  const values: string[] = []

  for (const [rawKey, vals] of Object.entries(normalizeKeys(filters))) {
    const key = resolveFieldName(rawKey)
    if (key.startsWith('trait.')) {
      const trait = key.slice(6)

      for (const val of vals) {
        traits.push(capitalize(trait))
        values.push(val.split('_').map(capitalize).join(' '))
      }
    } else {
      for (const val of vals) {
        params.append(key, val.replace(/_/g, ' '))
      }
    }
  }

  if (traits.length) {
    params.set('trait', traits.join(','))
    params.set('value', values.join(','))
  }

  return params
}

// --- VALUE ALIAS ---

export const VALUE_ALIASES: Record<string, Record<string, string>> = {
  side: { '0': 'ask', '1': 'bid' },
}

export const REVERSE_VALUE_ALIASES = Object.fromEntries(
  Object.entries(VALUE_ALIASES).map(([k, v]) => [v, k])
)

export function resolveValue(key: string, value: string): string {
  return VALUE_ALIASES[key]?.[value] ?? value
}

// --- FIELD ALIAS ---

export const FIELD_ALIASES: Record<string, string> = {
  maker: 'actor',
}

export const REVERSE_FIELD_ALIASES = Object.fromEntries(
  Object.entries(FIELD_ALIASES).map(([k, v]) => [v, k])
)

export function normalizeKeys(input: Record<string, string[]>): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(input).map(([k, v]) => [FIELD_ALIASES[k] ?? k, v])
  )
}

export function denormalizeKeys(input: string) {
  return input.replace(/\b[a-zA-Z0-9_]+\b/g, word => {
    return REVERSE_FIELD_ALIASES[word] ?? word
  })
}
