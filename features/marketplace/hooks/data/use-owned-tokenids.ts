import { useCallback, useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import type { PublicClient } from 'viem'

import { readOwned } from '@/lib/blockchain/erc721/erc721.read'
import type { Hex } from '@/domain/shared/eth'

export function useOwnedTokenIds(
  chainId: number | undefined,
  collection: Hex | undefined,
  account: Hex | undefined,
  readOwnedFn: (client: PublicClient, collection: Hex, account: Hex) => Promise<bigint[]> = readOwned // soft di
) {
  const [ids, setIds] = useState<bigint[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const client = usePublicClient({ chainId })

  const fetch = useCallback(async () => {
    if (!account || !collection || !client) return

    setIsFetching(true)

    const res = await readOwnedFn(client, collection, account)

    setIds(prev => {
      if (prev.length === res.length && prev.every((id, i) => id === res[i])) return prev
      return res
    })

    setIsFetching(false)
  }, [collection, account, client, readOwnedFn])

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
