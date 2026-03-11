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
}
// this is for later when fallback is implemented (not currently in use)
enum Provider {
  ALCHEMY,
  //MORALIS,
}

const converters = {
  // [Provider.ALCHEMY]: (arg: AlchemyNFT) => alchemyNFTToNFT(arg),
  // [Provider.MORALIS]: (arg: MoralisNFT) => moralisToNFT(arg),
}

// export const toNFT = (provider: Provider, arg: any) => {
//   const fn = converters[provider]
//   return fn(arg)
// }
