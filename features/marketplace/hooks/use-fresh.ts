import { useCallback, useState } from 'react'

export function useFresh<T extends string>() {
  const [fresh, setFresh] = useState<Partial<Record<T, Set<string>>>>({})

  const add = useCallback((key: T, id: string) => {
    setFresh(prev => {
      // create a new set and copy over (useEffect detects new reference)
      const next = new Set(prev[key])

      next.add(id)
      return { ...prev, [key]: next }
    })

    setTimeout(() => {
      setFresh(prev => {
        const next = new Set(prev[key])
        next.delete(id)
        return { ...prev, [key]: next }
      })
    }, 2500)
  }, [])

  function has(key: T, id: string) {
    return fresh[key]?.has(id) ?? false
  }

  return { add, has }
}
