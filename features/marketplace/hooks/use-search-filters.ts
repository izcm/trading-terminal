import { useState } from 'react'

import { normalizeKeys } from '@/lib/dmrkt-indexer/actions/logic/param-mapper'
import type { TabName } from '@/features/tab-config'
import type { Hex } from '@/domain/shared/eth'

// user is passed to enable feat replacing "me" with user address in searchstring
export function useSearchFilters(tab: TabName, user?: Hex) {
  const [filters, setFilters] = useState<Record<TabName, Record<string, string[]>>>({
    feed: { status: ['active'] },
    sales: { status: ['expired'] },
    explore: {},
  })

  // tracks which tabs have active "mine" filter
  const [mine, setMine] = useState<Record<TabName, boolean>>({
    feed: false,
    sales: false,
    explore: false,
  })

  function extractMine(value: string) {
    const mine = value.startsWith('mine')
    let rest = mine ? value.slice(4).trim() : value

    if (user) {
      rest = rest.replace(/\bme\b/g, user)
    }

    rest = normalizeKeys(rest)

    return { mine, rest }
  }

  function handleSearch(value: string) {
    // set potential 'mine' flag
    // nb: called of hook is resonsible for including owned tokenIds as query param
    const { mine: hasMine, rest: baseFilters } = extractMine(value)
    console.log(baseFilters)

    const rawParams = new URLSearchParams(baseFilters)
    const next: Record<string, string[]> = {}

    for (const [key, raw] of rawParams) {
      next[key] = [...new Set(raw.split(','))]
    }

    setFilters(prev => ({
      ...prev,
      [tab]: next,
    }))

    setMine(prev => ({
      ...prev,
      [tab]: hasMine,
    }))
  }

  return { filters, mine, handleSearch }
}
