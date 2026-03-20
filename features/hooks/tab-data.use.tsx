import { useEffect, useState } from 'react'
import { Page, Result } from '@/lib/utils/http'

export function useTabData<T extends { id: string }>(
  getPage: (filters: Record<string, string>) => Promise<Result<Page<T>>>,
  initialFilters: Record<string, string>
) {
  const [items, setItems] = useState<T[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [filters, setFilters] = useState(initialFilters)

  // fetch on filter change
  useEffect(() => {
    getPage(filters).then(res => {
      if (!res.ok) return
      setItems(res.data.items)
      setCursor(res.data.cursor)
      console.log(res)
    })
  }, [filters, getPage])

  // load more
  const loadMore = async () => {
    if (!cursor) return

    const res = await getPage(filters)
    if (!res.ok) return

    setItems(prev => {
      const existing = new Set(prev.map((i: T) => i.id))
      return [...prev, ...res.data.items.filter((i: T) => !existing.has(i.id))]
    })

    setCursor(res.data.cursor)
  }

  return {
    items,
    filters,
    setFilters,
    loadMore,
  }
}

// export function useTabData(getPage, initialFilters) {
//   const [items, setItems] = useState([])
//   const [cursor, setCursor] = useState(null)
//   const [filters, setFilters] = useState(initialFilters)

//   useEffect(() => {
//     getPage(filters).then(res => {
//       if (!res.ok) return
//       setItems(res.data.items)
//       setCursor(res.data.cursor)
//     })
//   }, [filters])

//   const loadMore = async () => {
//     if (!cursor) return
//     const res = await getPage(filters)
//     if (!res.ok) return

//     setItems(prev => {
//       const existing = new Set(prev.map(i => i.id))
//       return [...prev, ...res.data.items.filter(i => !existing.has(i.id))]
//     })

//     setCursor(res.data.cursor)
//   }

//   const setSearch = (value) => {
//     const next = {}
//     new URLSearchParams(value).forEach((v, k) => (next[k] = v))
//     setFilters(next)
//   }

//   return { items, loadMore, setSearch }
// }
