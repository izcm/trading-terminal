// Local Collection type - provider agnostic
import type { Hex } from 'viem'

export type AttributeSummary = Record<string, Record<string, number>>

export type Collection = {
  address: Hex
  name: string
  symbol: string
  totalSupply?: string
  tokenType?: string
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
