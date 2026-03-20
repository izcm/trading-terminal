export type NFT = {
  id: string

  chainId: number
  collection: string
  tokenId: string

  tokenUri?: string
  name?: string
  description?: string
  image?: string
  attributes?: {
    trait_type: string
    value: string
  }[]

  metaStatus: string
  metaError?: string

  createdAtBlock: number
  updatedAt: number
  createdAt: number
}
