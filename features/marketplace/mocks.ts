import type { NFT } from '@/domain/nft'
import type { Listing } from '@/domain/listing'
import type { Sale } from '@/domain/sale'
import { OrderSide } from '@/protocol/eip712/order'
import type { Hex } from '@/domain/shared/eth'

const COLLECTION = '0xcollection' as Hex
const ACTOR = '0xactor' as Hex
const CURRENCY = '0xcurrency' as Hex
const ORDER_HASH = '0xorderhash' as Hex

export const mockNFT = (overrides: Partial<NFT> = {}): NFT => ({
  id: '1:0xcollection:1',
  chainId: 1,
  collection: COLLECTION,
  tokenId: 1n,
  name: 'Mock NFT',
  description: '',
  image: '',
  attributes: [],
  createdAtBlock: 0n,
  createdAt: 0,
  ...overrides,
})

export const mockListing = (overrides: Partial<Listing> = {}): Listing => ({
  id: 'listing-1',
  chainId: 1,
  orderHash: ORDER_HASH,
  side: 'ask',
  isCollectionBid: false,
  collection: COLLECTION,
  tokenId: 1n,
  price: 1000000000000000000n,
  currency: CURRENCY,
  actor: ACTOR,
  start: 0,
  end: 9999999999,
  status: 'active',
  createdAt: 0,
  rawOrder: {
    side: OrderSide.Ask,
    actor: ACTOR,
    isCollectionBid: false,
    collection: COLLECTION,
    tokenId: '1',
    price: '1000000000000000000',
    currency: CURRENCY,
    start: 0,
    end: 9999999999,
    nonce: '0',
    signature: { v: 27, r: '0x0' as Hex, s: '0x0' as Hex },
  },
  ...overrides,
})

export const mockSale = (overrides: Partial<Sale> = {}): Sale => ({
  id: 'sale-1',
  chainId: 1,
  orderHash: ORDER_HASH,
  txHash: '0xtxhash' as Hex,
  collection: COLLECTION,
  tokenId: 1n,
  seller: ACTOR,
  buyer: '0xbuyer' as Hex,
  currency: CURRENCY,
  price: 1000000000000000000n,
  blockNumber: 1,
  timestamp: 0,
  logIndex: 0,
  createdAt: 0,
  ...overrides,
})
