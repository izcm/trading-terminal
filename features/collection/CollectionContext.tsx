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

export function useCollection(): NFTCollection | null {
  return useContext(CollectionContext)
}
