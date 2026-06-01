import type { Listing, ListingStatus } from '@/domain/listing'
import { Trade } from '../trade'
import { Hex } from './eth'

type ActivityStatus = ListingStatus

export type Activity = {
  source: 'trade' | 'listing'
  type: 'ask' | 'bid' | 'unknown'
  chainId: number
  collection: Hex
  tokenId: bigint
  price: bigint
  timestamp: number
  status?: ActivityStatus
  isCollectionBid?: boolean
  collectionSymbol?: string
}

export const activity = {
  fromListing(listing: Listing): Activity {
    return {
      source: 'listing',
      type: listing.side,
      chainId: listing.chainId,
      collection: listing.collection,
      tokenId: listing.tokenId,
      price: listing.price,
      timestamp: listing.end,
      isCollectionBid: listing.isCollectionBid,
      collectionSymbol: listing.nftCollection?.symbol ?? 'unknown',
      status: listing.status,
    }
  },

  fromTrade(trade: Trade): Activity {
    return {
      source: 'trade',
      type: trade.listing?.side ?? 'unknown',
      chainId: trade.chainId,
      collection: trade.collection,
      tokenId: trade.tokenId,
      price: trade.price,
      timestamp: trade.timestamp,
      collectionSymbol: trade.nftCollection?.symbol ?? 'unknown',
    }
  },
}
