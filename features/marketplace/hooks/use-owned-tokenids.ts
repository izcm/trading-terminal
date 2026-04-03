import { useCallback, useEffect, useState } from 'react'

import { readOwned } from '@/lib/blockchain/erc721/erc721.read'
import type { Hex } from '@/domain/shared/eth'

export function useOwnedTokenIds(collection?: Hex, user?: Hex) {
  const [ids, setIds] = useState<bigint[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const fetch = useCallback(async () => {
    if (!user || !collection) return

    setIsFetching(true)

    const res = await readOwned(collection, user)
    setIds(res)

    setIsFetching(false)
  }, [collection, user])

  useEffect(() => {
    ;(async () => await fetch())()
  }, [fetch])

  // on token buy
  const add = useCallback(
    (id: bigint) => {
      console.log('fuck me')
      setIds(prev => (prev.includes(id) ? prev : [...prev, id]))
    },
    [setIds]
  )

  const remove = useCallback(
    (id: bigint) => {
      setIds(prev => prev.filter(owned => owned !== id))
    },
    [setIds]
  )

  return { ids, refetch: fetch, isFetching, add, remove }
}
