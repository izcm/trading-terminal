import { useCallback, useEffect, useState } from 'react'

import { readOwned } from '@/lib/blockchain/erc721/erc721.read'
import type { Hex } from '@/domain/shared/eth'

export function useOwnedTokenIds(collection?: Hex, user?: Hex) {
  const [ids, setIds] = useState<bigint[]>([])

  const fetch = useCallback(async () => {
    if (!user || !collection) return

    const res = await readOwned(collection, user)
    setIds(res)
  }, [collection, user])

  useEffect(() => {
    ;(async () => await fetch())()
  }, [fetch])

  return { ids, refetch: fetch }
}
