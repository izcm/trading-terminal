import { FIELD_ALIASES } from '@/lib/dmrkt-indexer/actions/logic/param-mapper'

export function itemMatchesFilters(
  item: Record<string, unknown>,
  filters: Record<string, string[]>,
  aliasMap: Record<string, string | undefined> = FIELD_ALIASES,
  shouldSkip: (key: string) => boolean = key => key.startsWith('sort')
): boolean {
  return Object.entries(filters).every(([key, values]) => {
    if (values.length === 0) return true

    // if item does not have filter key
    // the ui ignores it so return true
    const trueKey = aliasMap[key] ?? key

    if (shouldSkip(key)) return true
    if (!Object.hasOwn(item, trueKey)) return true

    const itemVal = String(item[trueKey])
    return values.includes(itemVal)
  })
}
