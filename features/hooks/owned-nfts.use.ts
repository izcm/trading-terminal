import { useCallback, useState } from 'react'

import { readOwned } from '@/lib/blockchain/erc721/erc721.read'

import type { NFT } from '@/domain/nft'
import type { Hex } from '@/domain/shared/eth'

function useOwnedNFTs(collection: Hex, user: Hex) {
  const [items, setItems] = useState<NFT[]>()

  const fetchAll = useCallback(async () => {
    const ids = await readOwned(collection, user)

    if (!ids.length) {
      setItems([])
      return
    }
  }, [collection, user])

  return { items, refetch: fetchAll }
}
