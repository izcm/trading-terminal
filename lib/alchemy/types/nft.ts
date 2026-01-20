import { NFT } from '@/domain/types/nft'

export type AlchemyNFTResponse = {
  nfts: AlchemyNFT[]
  pageKey?: string
}

export type AlchemyNFT = {
  contract: {
    address: string
    name?: string
    symbol?: string
    totalSupply?: string
    tokenType?: string
    contractDeployer?: string
    deployedBlockNumber?: number
    openseaMetadata?: {
      floorPrice?: number
      collectionName?: string
      safelistRequestStatus?: string
      imageUrl?: string
      description?: string
      externalUrl?: string
      twitterUsername?: string
      discordUrl?: string
      bannerImageUrl?: string
      lastIngestedAt?: string
    }
    isSpam?: string
    spamClassifications?: string[]
  }

  tokenId: string
  tokenType: string

  name?: string
  description?: string

  image?: {
    cachedUrl?: string
    thumbnailUrl?: string
    pngUrl?: string
    originalUrl?: string
  }

  raw?: {
    tokenUri?: string
    metadata?: {
      image?: string
      name?: string
      description?: string
      attributes?: {
        value: string
        trait_type: string
      }[]
    }
    error?: string
  }

  animation?: {
    cachedUrl?: string
    contentType?: string
    size?: number
    orginalUrl?: string // alchemy typo lol
  }

  collection?: {
    name?: string
    slug?: string
    externalUrl?: string
    bannerImageUrl?: string
  }

  tokenUri?: string
  timeLastUpdated?: string
}

// Convert Alchemy NFT to local NFT type
export const toNFT = (alchemy: AlchemyNFT): NFT => {
  const fmtId = alchemy.tokenId.startsWith('0x')
    ? BigInt(alchemy.tokenId).toString()
    : alchemy.tokenId

  const image =
    alchemy.image?.originalUrl ||
    alchemy.image?.cachedUrl ||
    alchemy.image?.thumbnailUrl ||
    alchemy.image?.pngUrl ||
    null

  return {
    contract: alchemy.contract.address as `0x${string}`,
    tokenId: fmtId,
    name: alchemy.name || alchemy.raw?.metadata?.name || `#${fmtId}`,
    description: alchemy.description || alchemy.raw?.metadata?.description,
    image: image || 'https://cdn-icons-png.flaticon.com/512/9827/9827720.png',
    tokenType: alchemy.tokenType || 'Unknown',
    attributes:
      alchemy.raw?.metadata?.attributes?.map(attr => ({
        traitType: attr.trait_type,
        value: attr.value,
      })) || [],
    lastUpdated: alchemy.timeLastUpdated || 'Unknown',
  }
}
