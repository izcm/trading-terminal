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
}

export function toNFT(dto: NFTDTO): NFT {
  return {
    ...dto,
    tokenId: BigInt(dto.tokenId),
    createdAtBlock: BigInt(dto.createdAtBlock),
  }
}
