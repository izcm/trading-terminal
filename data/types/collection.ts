// Local Collection type - provider agnostic
export type AttributeSummary = Record<string, Record<string, number>>

export type Collection = {
  address: `0x${string}`
  name: string
  symbol: string
  totalSupply: string
  tokenType: string
  description?: string
  imageUrl?: string
  bannerImageUrl?: string
  marketData?: {
    floorPrice?: number
    collectionName?: string
  }
  socials?: {
    twitterUsername?: string
    discordUrl?: string
    externalUrl?: string
  }
}

export type Listing = {
  tokenId: string
  image: string
  name: string
  price: string
}
