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

  for (const [key, vals] of Object.entries(filters)) {
    if (key.startsWith('trait.')) {
      const trait = key.slice(6)

      for (const val of vals) {
        traits.push(trait)
        values.push(val)
      }
    } else {
      for (const val of vals) {
        params.append(key, val)
      }
    }
  }

  if (traits.length) {
    params.set('trait', traits.join(','))
    params.set('value', values.join(','))
  }

  return params
}

const FIELD_ALIASES: Record<string, string> = {
  maker: 'actor',
}

export function normalizeKeys(input: string) {
  return input.replace(/\b[a-zA-Z0-9_]+\b/g, word => {
    return FIELD_ALIASES[word] ?? word
  })
}
