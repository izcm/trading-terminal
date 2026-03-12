import type { Listing } from '@/domain/listing'
import { Sale } from '../../sale'
import { Hex } from './eth'

// todo: use bigints in other types!
export type Activity = {
  type: 'ask' | 'bid' | 'unknown'
  chainId: number
  collection: Hex
  tokenId: bigint
  price: bigint
  timestamp: number
  isCollectionBid?: boolean
  collectionSymbol?: string
}

export const activity = {
  fromListing(listing: Listing): Activity {
    return {
      type: listing.type,
      chainId: listing.chainId,
      collection: listing.collection,
      tokenId: listing.tokenId,
      price: listing.price,
      timestamp: listing.start,
      isCollectionBid: listing.isCollectionBid,
      collectionSymbol: listing.nftCollection?.symbol ?? 'unknown',
    }
  },

  fromSale(sale: Sale): Activity {
    return {
      type: sale.order?.type ?? 'unknown',
      chainId: sale.chainId,
      collection: sale.collection,
      tokenId: sale.tokenId,
      price: BigInt(sale.price),
      timestamp: sale.timestamp,
      collectionSymbol: sale.nftCollection?.symbol ?? 'unknown',
    }
  },
}
