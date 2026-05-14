'use client'

import { createContext, useContext } from 'react'

import type { NFTCollection } from '@/domain/nft-collection'

const CollectionContext = createContext<NFTCollection | null>(null)

export function CollectionProvider({
  collection,
  children,
}: {
  collection: NFTCollection
  children: React.ReactNode
}) {
  return <CollectionContext.Provider value={collection}>{children}</CollectionContext.Provider>
}

// domain objects may include nftCollection from the API, but UI utilities like
// padTokenId should come from here — one source of truth for collection-derived logic
export function useCollection() {
  const collection = useContext(CollectionContext)

  const padTokenId = (tokenId: bigint) => {
    const len = collection?.totalSupply ? String(collection.totalSupply).length : undefined
    return len ? tokenId.toString().padStart(len, '0') : tokenId.toString()
  }

  return { collection, padTokenId }
}
