// Local Collection type - provider agnostic
import type { Hex } from 'viem'

type Status = 'DONE' | 'PENDING' | 'FAILED'

export type NFTCollection = {
  // from NFTCollectionBase
  chainId: number
  address: Hex

  imageUrl?: string
  bannerImageUrl?: string

  marketData?: {
    floorPrice?: number
  }

  socials?: {
    twitterUsername?: string
    externalUrl?: string
  }

  metaStatus: Status

  updatedAt: number

  name: string
  symbol: string
  tokenType: string
  totalSupply: string
}

export type TopNFTCollection = NFTCollection & {
  summary: {
    activeAskCount: number
    activeBidCount: number
    activeCbCount: number
    totalActive: number
  }
}
