import { NFT_PLACEHOLDER_IMAGE } from './constants/placeholders'

import type { Hex } from './shared/eth'

export type NFTAttribute = {
  trait_type: string
  value: string
}

export type NFT = {
  id: string

  chainId: number
  collection: Hex
  tokenId: bigint

  tokenUri?: string
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]

  createdAtBlock: bigint
}

type NFTMetadata = {
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
}

export function mapTokenUriToNFT(
  chainId: number,
  address: Hex,
  tokenId: bigint,
  tokenUri: string
): NFT {
  const meta = parseTokenURI(tokenUri)

  return {
    id: `${chainId}:${address}:${tokenId}`,
    chainId,
    collection: address,
    tokenId,
    tokenUri,
    createdAtBlock: 0n,
    ...meta,
  }
}

// Made defensive because tokenURI content is often inconsistent across collections.
export function parseTokenURI(tokenUri: string): NFTMetadata {
  try {
    const base64 = tokenUri.split(',')[1]
    const json = atob(base64)
    const data = JSON.parse(json) as Record<string, unknown>

    const name = typeof data.name === 'string' ? data.name : 'Unknown NFT'
    const description = typeof data.description === 'string' ? data.description : ''
    const image = typeof data.image === 'string' ? data.image : NFT_PLACEHOLDER_IMAGE

    const attributes: NFTAttribute[] = Array.isArray(data.attributes)
      ? data.attributes
          .map(attr => {
            if (
              typeof attr === 'object' &&
              attr !== null &&
              'trait_type' in attr &&
              'value' in attr &&
              typeof attr.trait_type === 'string' &&
              typeof attr.value === 'string'
            ) {
              return {
                trait_type: attr.trait_type,
                value: attr.value,
              }
            }

            return null
          })
          .filter((attr): attr is NFTAttribute => attr !== null)
      : []

    return {
      name,
      description,
      image,
      attributes,
    }
  } catch {
    return {
      name: 'Unknown NFT',
      description: '',
      image: NFT_PLACEHOLDER_IMAGE,
      attributes: [],
    }
  }
}
