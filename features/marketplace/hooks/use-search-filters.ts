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

  // set potential 'mine' flag
  // nb: parent is resonsible for including owned tokenIds in query
  function handleSearch(value: string) {
    const { mine: hasMine, rest } = extractMine(value)
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
      next[key] = [...new Set(raw.split(','))]
    }

    console.log('handle search')
    console.log('next: ', next)
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
