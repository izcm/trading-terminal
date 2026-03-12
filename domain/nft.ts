import type { Hex } from './shared/types/eth'

// Local NFT type - provider agnostic
// export type NFT = {
//   contract: Hex
//   tokenId: string
//   name: string
//   description?: string
//   image: string
//   tokenType: string
//   attributes: Array<{
//     traitType: string
//     value: string
//   }>
//   lastUpdated: string
// }

export type NFT = {
  id: string // just set to tokenid
  tokenId: string
  tokenURI: string
  chainId: number
  collection: Hex
}
