import type { NFTCollection } from '@/domain/nft-collection'
import type { Hex } from '@/domain/shared/eth'

type Status = 'DONE' | 'PENDING' | 'FAILED'

export type NFTCollectionDTO = {
  id: string

  chainId: number
  address: Hex

  imageUrl?: string
  bannerImageUrl?: string

  socials?: {
    twitterUsername?: string
    externalUrl?: string
  }

  metaStatus: Status

  updatedAt: number

  name?: string | null
  symbol?: string | null
  tokenType?: string | null
  totalSupply?: string | null

  summary?: {
    activeAskCount: number
    activeBidCount: number
    activeCbCount: number
    totalActive: number
  }
}

function toOptionalBigInt(value: string | null | undefined): bigint | undefined {
  if (!value) return undefined

  try {
    return BigInt(value)
  } catch {
    return undefined
  }
}

export function toNFTCollection(dto: NFTCollectionDTO): NFTCollection {
  return {
    ...dto,
    name: dto.name ?? 'unknown collection',
    symbol: dto.symbol ?? 'N/A',
    tokenType: dto.tokenType ?? 'ERC721',

    totalSupply: toOptionalBigInt(dto.totalSupply),
  }
}
