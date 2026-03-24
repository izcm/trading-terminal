import { useCallback, useEffect, useState } from 'react'

import { readOwned } from '@/lib/blockchain/erc721/erc721.read'
import type { Hex } from '@/domain/shared/eth'

export function useOwnedTokenIds(collection: Hex, user?: Hex) {
  const [ids, setIds] = useState<string[]>([])

  const fetch = useCallback(async () => {
    if (!user) return

    const res = await readOwned(collection, user)
    setIds(res)
  }, [collection, user])

  useEffect(() => {
    ;(async () => fetch())()
  }, [fetch])

  return { ids, refetch: fetch }
}
