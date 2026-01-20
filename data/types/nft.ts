import { AlchemyNFT, toNFT as alchemyNFTToNFT } from '@/lib/alchemy/types/nft'
import type { Hex32 } from '@/lib/utils/format/hex32'

// Local NFT type - provider agnostic
export type NFT = {
  contract: Hex32
  tokenId: string
  name: string
  description?: string
  image: string
  tokenType: string
  attributes: Array<{
    traitType: string
    value: string
  }>
  lastUpdated: string
}

// this is for later when fallback is implemented (not currently in use)
enum Provider {
  ALCHEMY,
  //MORALIS,
}

const converters = {
  [Provider.ALCHEMY]: (arg: AlchemyNFT) => alchemyNFTToNFT(arg),
  // [Provider.MORALIS]: (arg: MoralisNFT) => moralisToNFT(arg),
}

export const toNFT = (provider: Provider, arg: any) => {
  const fn = converters[provider]
  return fn(arg)
}
