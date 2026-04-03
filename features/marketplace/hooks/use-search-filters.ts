import { useState } from 'react'

import { normalizeKeys } from '@/lib/dmrkt-indexer/actions/logic/param-mapper'
import type { TabName } from '@/features/tab-config'
import type { Hex } from '@/domain/shared/eth'

// user is passed to enable feat replacing "me" with user address in searchstring
export function useSearchFilters(tab: TabName, user?: Hex) {
  const [filters, setFilters] = useState<Record<TabName, Record<string, string[]>>>({
    feed: { status: ['active'] },
    sales: {},
    explore: {},
  })

  // tracks which tabs have active "mine" filter
  const [mineFlag, setMineFlag] = useState<Record<TabName, boolean>>({
    feed: false,
    sales: false,
    explore: false,
  })

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

  return { filters, mineFlag: mineFlag, handleSearch }
}
