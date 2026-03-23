/**
 * Maps filter on format key=v1,v2 to format server expects key=v1&key=v2
 *
 * @param filters pairs of key values[]
 * @returns URLSearchParams with repeated query keys.
 */
export function toSearchParams(filters: Record<string, string[]>) {
  const params = new URLSearchParams()

  const traits = filters.trait ?? []
  const values = filters.value ?? []

  for (const [key, vals] of Object.entries(filters)) {
    if (key === 'trait' || key === 'value') continue
    vals.map(v => params.append(key, v))
  }

  let lastDefinedTrait = traits[0]

  for (let i = 0; i < Math.max(traits.length, values.length); i++) {
    if (traits[i]) lastDefinedTrait = traits[i]

    params.append('trait', lastDefinedTrait)
    if (values[i]) params.append('value', values[i])
  }

  return params
}
