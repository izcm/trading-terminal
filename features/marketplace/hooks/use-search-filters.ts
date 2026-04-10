import { useState } from 'react'

import { normalizeKeys } from '@/lib/dmrkt-indexer/actions/logic/param-mapper'
import type { TabName } from '@/features/tab-config'
import type { Hex } from '@/domain/shared/eth'

const DEFAULT_FILTERS: Record<TabName, Record<string, string[]>> = {
  feed: { status: ['active'] },
  sales: { sortField: ['timestamp'] },
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

  function extractMyTokensFlag(value: string) {
    const keyword = 'mytokens'

    const hasFlag = value.toLowerCase().startsWith(keyword)
    let rest = hasFlag ? value.slice(keyword.length).trim() : value

    if (user) {
      rest = rest.replace(/\bme\b/g, user)
    }

    rest = normalizeKeys(rest)

    return { hasFlag, rest }
  }

  // nb: parent is resonsible for including owned tokenIds in query
  function handleSearch(value: string) {
    const { hasFlag, rest } = extractMyTokensFlag(value)

    const baseFilters = rest.trim().replace(/\s+/g, '&')

    const rawParams = new URLSearchParams(baseFilters)
    const next: Record<string, string[]> = {}

    const traits = rawParams.get('trait')?.split(',') ?? []
    const values = rawParams.get('value')?.split(',') ?? []

    traits.forEach((trait, i) => {
      const val = values[i]
      if (!val) return // todo: length mismatch ui indicator
      ;(next[`trait.${trait}`] ??= []).push(val)
    })

    for (const [key, raw] of rawParams) {
      if (key === 'trait' || key === 'value') continue

      const values = raw.split(',')

      if (key === 'side') {
        const v = values[0]?.toLowerCase()

        if (v !== 'ask' && v !== 'bid' && v !== '0' && v !== '1') continue

        const mapped = v === 'ask' ? '0' : v === 'bid' ? '1' : v
        next[key] = [mapped]
        continue
      }

      next[key] = [...new Set(raw.split(','))]
    }

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
