import { FIELD_NAME_MAP } from '@/features/marketplace/lib/field-config'

export function itemMatchesFilters(
  item: Record<string, unknown>,
  filters: Record<string, string[]>,
  aliasMap: Record<string, string> = {},
  shouldSkip: (key: string) => boolean = key => key.startsWith('sort')
): boolean {
  return Object.entries(filters).every(([key, values]) => {
    if (values.length === 0) return true

    // if item does not have filter key
    // the ui ignores it so return true
    const trueKey = aliasMap[key] ?? FIELD_NAME_MAP[key.toLowerCase()] ?? key

    if (shouldSkip(key)) return true
    if (!Object.hasOwn(item, trueKey)) return true

    const itemVal = String(item[trueKey])
    return values.includes(itemVal)
  })
}
