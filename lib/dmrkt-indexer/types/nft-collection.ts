// Local Collection type - provider agnostic
import type { Hex } from '@/domain/shared/types/eth'

type Status = 'DONE' | 'PENDING' | 'FAILED'

export type NFTCollection = {
  id: string

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

  summary?: {
    activeAskCount: number
    activeBidCount: number
    activeCbCount: number
    totalActive: number
  }
}
