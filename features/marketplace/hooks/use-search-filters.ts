import { useState } from 'react'

import type { TabName } from '@/features/tab-config'
import type { Hex } from '@/domain/shared/eth'

const DEFAULT_FILTERS: Record<TabName, Record<string, string[]>> = {
  feed: { status: ['active'] },
  sales: {},
  explore: {},
}

const DEFAULT_MINE_FLAG: Record<TabName, boolean> = {
  feed: false,
  sales: false,
  explore: false,
}

// user is passed to enable feat replacing "me" with user address in searchstring
export function useSearchFilters(tab: TabName, user?: Hex) {
  const [filters, setFilters] = useState<Record<TabName, Record<string, string[]>>>(DEFAULT_FILTERS)

  // tracks which tabs have active "mine" filter
  const [mineFlag, setMineFlag] = useState<Record<TabName, boolean>>(DEFAULT_MINE_FLAG)

  function extractMineFlag(value: string) {
    const keyword = 'mine'

    const regex = new RegExp(`\\b${keyword}\\b`, 'i')
    const hasFlag = regex.test(value)
    let rest = hasFlag ? value.replace(regex, '').trim() : value

    if (user) {
      rest = rest.replace(/\bme\b/g, user)
    }

    return { hasFlag, rest }
  }

  function handleSearch(value: string) {
    const { hasFlag, rest } = extractMineFlag(value)

    // parse raw string into key: [values]
    const next: Record<string, string[]> =
      rest.length === 0
        ? {}
        : Object.fromEntries(
            rest
              .trim()
              .split(/\s+/)
              .map(pair => {
                const [key, raw] = pair.split('=')
                return [key, raw ? raw.split(',') : []]
              })
          )

    setFilters(prev => ({
      ...prev,
      [tab]: next,
    }))

    setMineFlag(prev => ({
      ...prev,
      [tab]: hasFlag,
    }))
  }

  function resetFilters(targetTab: TabName) {
    setFilters(prev => ({ ...prev, [targetTab]: DEFAULT_FILTERS[targetTab] }))
    setMineFlag(prev => ({ ...prev, [targetTab]: DEFAULT_MINE_FLAG[targetTab] }))
  }

  return { filters, setFilters, mineFlag: mineFlag, handleSearch, resetFilters }
}
