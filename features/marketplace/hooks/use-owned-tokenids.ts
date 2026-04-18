import { useCallback, useEffect, useState } from 'react'

import { readOwned } from '@/lib/blockchain/erc721/erc721.read'
import type { Hex } from '@/domain/shared/eth'

export function useOwnedTokenIds(
  collection: Hex | undefined,
  account: Hex | undefined,
  readOwnedFn: (collection: Hex, account: Hex) => Promise<bigint[]> = readOwned // soft di
) {
  const [ids, setIds] = useState<bigint[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const fetch = useCallback(async () => {
    if (!account || !collection) return

    setIsFetching(true)

    const res = await readOwnedFn(collection, account)

    setIds(prev => {
      if (prev.length === res.length && prev.every((id, i) => id === res[i])) return prev
      return res
    })

    setIsFetching(false)
  }, [collection, account, readOwnedFn])

  useEffect(() => {
    ;(async () => await fetch())()
  }, [fetch])

  // on token buy
  const add = useCallback(
    (id: bigint) => {
      setIds(prev => (prev.includes(id) ? prev : [...prev, id]))
    },
    [setIds]
  )

  // on token sell
  const remove = useCallback(
    (id: bigint) => {
      setIds(prev => prev.filter(owned => owned !== id))
    },
    [setIds]
  )

  return { ids, refetch: fetch, isFetching, add, remove }
}
