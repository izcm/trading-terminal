import type { Collection } from '@/data/types'

export const getDemoCollections = (): Collection[] => {
  return DEMO_COLLECTIONS
}

// TODO: addresses are already deterministic, but make this less "hardcoded" vibe
const DEMO_COLLECTIONS: Collection[] = [
  {
    address: '0x87a97BC3a0EC7952F4F2C8d22eD5c0A56811fd10',
    name: 'DMrktSeal',
    symbol: 'DSEAL',
    totalSupply: '100',
    tokenType: 'ERC721',
    description: 'DMrkt native NFT',
    imageUrl: '',
    bannerImageUrl: '',
    socials: {
      twitterUsername: 'Isabel Ch',
      discordUrl: '',
    },
  },
  {
    address: '0x685009Edc4Df588555d7e7Ed4854c450b423DD97',
    name: 'DMrktGremlin',
    symbol: 'DGREM',
    totalSupply: '100',
    tokenType: 'ERC721',
    description: 'DMrkt native NFT',
    imageUrl: '',
    bannerImageUrl: '',
    socials: {
      twitterUsername: 'Isabel Ch',
      discordUrl: '',
    },
  },
]

// nft_c_0 = "0x2E10a0A6383a084cc7449fe58D40D3702A8E57F4"
// nft_c_1 = "0x8522874371974bF1dac8dF496d372319DF943A17"
