import { useState } from 'react'

import type { TabName } from '@/features/tab-config'
import type { Hex } from '@/domain/shared/eth'

export const DEFAULT_FILTERS: Record<TabName, Record<string, string[]>> = {
  // feed: { status: ['active'] },
  feed: { status: ['active'] },
  trades: {},
  explore: {},
}

export const DEFAULT_MINE_FLAG: Record<TabName, boolean> = {
  feed: false,
  trades: false,
  explore: false,
}

/**
 * Parses user search input to filters key value pairs.
 * This is the middlelayer between UI search input and parsing to API format.
 *
 * eg. user inputs the raw string tokenId=1,2,3
 *  - handleSearch takes string, parses it to { tokenId: ["1", "2", "3"]}
 *  - handleSearch updates filters to include the new pair
 */
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
      rest.trim().length === 0
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

  function resetMineFlag(targetTab: TabName) {
    setMineFlag(prev => ({ ...prev, [targetTab]: false }))
  }

  return { filters, setFilters, mineFlag, handleSearch, resetFilters, resetMineFlag }
}
