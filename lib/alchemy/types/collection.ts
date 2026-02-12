import { NFTCollection } from '@/domain/types'

export type AlchemyCollection = {
  address: string
  name: string
  symbol: string
  totalSupply: string
  tokenType: string
  contractDeployer: string
  deployedBlockNumber: number

  openSeaMetadata?: {
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

// Convert Alchemy Collection to local Collection type
export const toCollection = (alchemy: AlchemyCollection): NFTCollection => {
  const os = alchemy.openSeaMetadata

  // Try all available image sources in order of preference
  const imageUrl = os?.imageUrl || os?.externalUrl
  const bannerUrl =
    os?.bannerImageUrl ||
    'https://img.freepik.com/free-vector/pixel-space-background-set_107791-34717.jpg?semt=ais_hybrid&w=740&q=80'

  return {
    address: alchemy.address as `0x${string}`,
    name: alchemy.name,
    symbol: alchemy.symbol,
    totalSupply: alchemy.totalSupply,
    tokenType: alchemy.tokenType,

    description: os?.description,
    imageUrl,
    bannerImageUrl: bannerUrl,

    marketData: {
      floorPrice: os?.floorPrice,
      collectionName: os?.collectionName,
    },

    socials: {
      twitterUsername: os?.twitterUsername,
      discordUrl: os?.discordUrl,
      externalUrl: os?.externalUrl,
    },
  }
}
