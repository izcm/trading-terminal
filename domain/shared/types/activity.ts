import { Listing } from '@/lib/dmrkt-indexer/types/listing'

import { Sale } from '../../sale'
import { addrShort } from '../utils/fmt/hex'

export type Activity = {
  activityType: 'ask' | 'bid' | 'unknown'
  isCollectionBid: boolean

  timestamp: number

  collection: string // can be addr / name / symbol
  tokenId: string

  price: string
}

export const activity = {
  fromListing(listing: Listing): Activity {
    return {
      activityType: listing.type,
      isCollectionBid: listing.isCollectionBid,

      timestamp: listing.start,

      collection: listing.nftCollection
        ? listing.nftCollection.symbol
        : addrShort(listing.collection),
      tokenId: listing.tokenId,
      price: listing.price,
    }
  },
  fromSale(sale: Sale): Activity {
    return {
      activityType: sale.order ? sale.order.type : 'unknown',
      isCollectionBid: false, // dont care about this in ui (if care => use full sale)

      timestamp: sale.timestamp, // block timestamps

      collection: sale.nftCollection ? sale.nftCollection.symbol : sale.collection,
      tokenId: sale.tokenId,

      price: sale.price,
    }
  },
}
