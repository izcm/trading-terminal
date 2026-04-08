import { TabName } from '@/features/tab-config'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useFresh(activeTab: TabName) {
  const [fresh, setFresh] = useState<Record<string, Set<string> | undefined>>({})
  const pending = useRef<Record<string, Set<string> | undefined>>({})

  function startTimer(key: string) {
    setTimeout(() => {
      setFresh(prev => ({ ...prev, [key]: new Set() }))
    }, 2000)
  }

  const add = useCallback(
    (key: string, id: string) => {
      setFresh(prev => {
        // create a new set and copy over (useEffect detects new reference)
        const next = new Set(prev[key])
        next.add(id)
        return { ...prev, [key]: next }
      })

      if (key === activeTab) {
        // run timer
        startTimer(key)
      } else {
        // park it for when user visits tab
        const parked = pending.current[key] ?? new Set<string>()
        parked.add(id)
        pending.current = { ...pending.current, [key]: parked }
      }
    },
    [activeTab]
  )

  useEffect(() => {
    // flush pending on tab switch
    const parked = pending.current[activeTab]
    if (!parked?.size) return

    parked.forEach(() => startTimer(activeTab))
    pending.current = { ...pending.current, [activeTab]: new Set() }
  }, [activeTab])

  function has(key: string, id: string) {
    return fresh[key]?.has(id) ?? false
  }

  return { add, has }
}
