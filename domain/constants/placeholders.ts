import type { NFT } from '../nft'

export const NFT_PLACEHOLDER_IMAGE = '/placeholders/token-couldnt-read.svg'

export const NFT_LOADING_IMAGE = '/placeholders/token-waiting.svg'

export const PLACEHOLDER_NFT: NFT = {
  id: 'placeholder',
  chainId: 0,
  collection: '0x0000000000000000000000000000000000000000',
  tokenId: 0n,
  name: '???',
  description: '',
  image: NFT_LOADING_IMAGE,
  attributes: [
    { trait_type: '---', value: '---' },
    { trait_type: '---', value: '---' },
    { trait_type: '---', value: '---' },
    { trait_type: '---', value: '---' },
    { trait_type: '---', value: '---' },
  ],
  createdAtBlock: 0n,
}
