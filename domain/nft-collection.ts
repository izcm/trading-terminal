import type { Hex } from './shared/eth'

export type NFTCollectionStatus = 'DONE' | 'PENDING' | 'FAILED'

export type NFTCollection = {
  id: string

  chainId: number
  address: Hex

  imageUrl?: string
  bannerImageUrl?: string

  socials?: {
    twitterUsername?: string
    externalUrl?: string
  }

  metaStatus: NFTCollectionStatus

  updatedAt: number

  name: string
  symbol: string
  tokenType: string
  totalSupply?: bigint

  summary?: {
    activeAskCount: number
    activeBidCount: number
    activeCbCount: number
    totalActive: number
  }
}
