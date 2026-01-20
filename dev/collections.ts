// all of this is just placeholder stuff
// since the demo is on a local anvil fork

import type { Collection } from '@/domain/types'
import type { Hex32 } from '@/lib/utils/format/hex32'

export const getCollections = (): Collection[] => {
  return DEMO_COLLECTIONS
}

export const getCollection = (addr: Hex32) => {
  return DEMO_COLLECTIONS.find(col => col.address === addr)
}

// TODO: addresses are already deterministic, but make this less "hardcoded" vibe
const DEMO_COLLECTIONS: Collection[] = [
  {
    address: '0xC0Bd89573eDD265D3d9E0073f6D1e21e9Df5E1DA',
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
    address: '0x6FE69253967982531bDe0C06476e7fe427f3F56c',
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
