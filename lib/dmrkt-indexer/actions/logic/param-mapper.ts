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

  for (const [rawKey, vals] of Object.entries(filters)) {
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

export const FIELD_ALIASES: Record<string, string> = {
  maker: 'actor',
}

export const REVERSE_FIELD_ALIASES = Object.fromEntries(
  Object.entries(FIELD_ALIASES).map(([k, v]) => [v, k])
)

export function normalizeKeys(input: string) {
  return input.replace(/\b[a-zA-Z0-9_]+\b/g, word => {
    return FIELD_ALIASES[word] ?? word
  })
}

export function denormalizeKeys(input: string) {
  return input.replace(/\b[a-zA-Z0-9_]+\b/g, word => {
    return REVERSE_FIELD_ALIASES[word] ?? word
  })
}
