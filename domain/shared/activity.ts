import type { Listing } from '@/domain/listing'
import { Sale } from '../sale'
import { Hex } from './eth'

export type Activity = {
  source: 'sale' | 'listing'
  type: 'ask' | 'bid' | 'unknown'
  chainId: number
  collection: Hex
  tokenId: bigint
  price: bigint
  timestamp: number
  status?: string
  isCollectionBid?: boolean
  collectionSymbol?: string
}

export const activity = {
  fromListing(listing: Listing): Activity {
    return {
      source: 'listing',
      type: listing.type,
      chainId: listing.chainId,
      collection: listing.collection,
      tokenId: listing.tokenId,
      price: listing.price,
      timestamp: listing.start,
      isCollectionBid: listing.isCollectionBid,
      collectionSymbol: listing.nftCollection?.symbol ?? 'unknown',
      status: listing.status,
    }
  },

  fromSale(sale: Sale): Activity {
    return {
      source: 'sale',
      type: sale.listing?.type ?? 'unknown',
      chainId: sale.chainId,
      collection: sale.collection,
      tokenId: sale.tokenId,
      price: sale.price,
      timestamp: sale.timestamp,
      collectionSymbol: sale.nftCollection?.symbol ?? 'unknown',
    }
  },
}
