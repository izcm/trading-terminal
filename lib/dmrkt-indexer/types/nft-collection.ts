import type { NFTCollection } from '@/domain/nft-collection'
import type { Hex } from '@/domain/shared/eth'

type Status = 'DONE' | 'PENDING' | 'FAILED'

export type NFTCollectionDTO = {
  id: string

  chainId: number
  address: Hex

  imageUrl?: string
  bannerImageUrl?: string

  marketData?: {
    floorPrice?: string
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

export function toNFTCollection(dto: NFTCollectionDTO): NFTCollection {
  return {
    ...dto,
    marketData: dto.marketData
      ? {
          ...dto.marketData,
          floorPrice:
            dto.marketData.floorPrice === undefined ? undefined : BigInt(dto.marketData.floorPrice),
        }
      : undefined,
    totalSupply: BigInt(dto.totalSupply),
  }
}
