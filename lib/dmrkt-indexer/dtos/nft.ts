import { NFT_PLACEHOLDER_IMAGE } from '@/domain/constants/placeholders'
import type { NFT } from '@/domain/nft'
import type { Hex } from '@/domain/shared/eth'

export type NFTDTO = {
  id: string

  chainId: number
  collection: Hex
  tokenId: string

  tokenUri?: string
  name?: string
  description?: string
  image?: string
  attributes?: {
    trait_type: string
    value: string
  }[]

  createdAtBlock: number

  createdAt: number
}

export function toNFT(dto: NFTDTO): NFT {
  return {
    ...dto,
    image: dto.image || NFT_PLACEHOLDER_IMAGE,
    name: dto.name || `#${dto.tokenId}`,
    description: dto.description || 'On-Chain NFT',
    attributes: dto.attributes ?? [],
    tokenId: BigInt(dto.tokenId),
    createdAtBlock: BigInt(dto.createdAtBlock),
  }
}
