import { TabName } from '@/features/tab-config'
import { useState } from 'react'

export function useSearchFilters(tab: TabName) {
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
    const rest = mine ? value.slice(4).trim() : value

    return { mine, rest }
  }

  function handleSearch(value: string) {
    console.log(value)
    const { mine: hasMine, rest: baseFilters } = extractMine(value)

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
