import { Listing } from '@/lib/dmrkt-indexer/types/listing'

import { Sale } from '../../sale'
import { Hex } from './eth'

export type Activity = {
  activityType: 'ask' | 'bid' | 'unknown'
  isCollectionBid: boolean

  timestamp: number

  collectionAddress: Hex // can be addr / name / symbol
  collectionSymbol: string

  tokenId: string

  price: string
}

export const activity = {
  fromListing(listing: Listing): Activity {
    return {
      activityType: listing.type,
      isCollectionBid: listing.isCollectionBid,

      timestamp: listing.start,

      collectionAddress: listing.collection,
      collectionSymbol: listing.nftCollection?.symbol ?? 'UNKNOWN',

      tokenId: listing.tokenId,

      price: listing.price,
    }
  },
  fromSale(sale: Sale): Activity {
    return {
      activityType: sale.order ? sale.order.type : 'unknown',
      isCollectionBid: false, // dont care about this in ui (if care => use full sale)

      timestamp: sale.timestamp, // block timestamps

      collectionAddress: sale.collection,
      collectionSymbol: sale.nftCollection?.symbol ?? 'UNKNOWN',

      tokenId: sale.tokenId,

      price: sale.price,
    }
  },
}
