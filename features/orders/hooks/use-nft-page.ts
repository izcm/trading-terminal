import { useCallback, useState } from 'react'

import { NFT } from '@/domain/nft'
import { getDmrktNFTs } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

export function useNFTPage(filters: Record<string, string[]>) {
  const [items, setItems] = useState<NFT[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState<boolean>(false)

  // --- first page (reset + load)
  const fetchFirstPage = useCallback(async () => {
    setInitialLoading(true)

    const res = await getDmrktNFTs({ ...filters, cursor: null })
    if (res.ok) {
      setItems(res.data.items)
      setCursor(res.data.cursor ?? null)
    }

    setInitialLoading(false)
  }, [filters])

  // // --- next page (append)
  // const fetchNextPage = useCallback(async () => {
  //   if (!cursor) return

  //   const res = await getDmrktNFTs({ ...filters, cursor })
  //   if (res.ok) {
  //     setItems(prev => [...prev, ...res.data.items])
  //     setCursor(res.data.cursor ?? null)
  //   }
  // }, [filters, cursor])

  return {
    items,
    cursor,
    initialLoading,
    fetchFirstPage,
    // fetchNextPage,
  }
}
