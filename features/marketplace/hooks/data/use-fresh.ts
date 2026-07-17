import { TabName } from '@/features/tab-config'
import { useCallback, useEffect, useRef, useState } from 'react'

type UseFreshOptions = {
  // when true, items added to an inactive tab are discarded instead of
  // queued as pending / flushed when that tab becomes active
  onlyForActiveTab?: boolean
}

export function useFresh(activeTab: TabName, options: UseFreshOptions = {}) {
  const { onlyForActiveTab = false } = options

  const [fresh, setFresh] = useState<Record<string, Set<string>>>({})
  const pending = useRef<Record<string, Set<string>>>({})

  function startTimer(tab: TabName) {
    setTimeout(() => {
      setFresh(prev => ({ ...prev, [tab]: new Set() }))
    }, 2000)
  }

  const add = useCallback(
    (tab: TabName, id: string) => {
      if (tab === activeTab) {
        // active → fresh immediately
        setFresh(prev => {
          const next = new Set(prev[tab] ?? [])
          next.add(id)
          return { ...prev, [tab]: next }
        })

        startTimer(tab)
      } else if (!onlyForActiveTab) {
        // inactive → pending
        const nextPending = new Set(pending.current[tab] ?? [])
        nextPending.add(id)
        pending.current = { ...pending.current, [tab]: nextPending }
      }
    },
    [activeTab, onlyForActiveTab]
  )

  // manual flush
  const flush = useCallback((tab: TabName) => {
    const parked = pending.current[tab]
    if (!parked?.size) return

    pending.current = { ...pending.current, [tab]: new Set() }

    setFresh(prev => {
      const next = new Set(prev[tab] ?? [])
      parked.forEach(id => next.add(id))
      return { ...prev, [tab]: next }
    })

    startTimer(tab)
  }, [])

  useEffect(() => {
    flush(activeTab)
  }, [activeTab, flush])

  function isFresh(tab: string, id: string) {
    return fresh[tab]?.has(id) ?? false
  }

  function isPending(tab: string, id: string) {
    return pending.current[tab]?.has(id) ?? false
  }

  return { add, flush, isFresh, isPending }
}
