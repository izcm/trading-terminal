import type { Listing, ListingStatus } from '@/domain/listing'
import { Sale } from '../sale'
import { Hex } from './eth'

type ActivityStatus = ListingStatus

export type Activity = {
  source: 'sale' | 'listing'
  type: 'ask' | 'bid' | 'unknown'
  chainId: number
  collection: Hex
  tokenId: bigint
  price: bigint
  timestamp: number
  status?: ActivityStatus
  isCollectionBid?: boolean
  collectionSymbol?: string
  supplyDecimals?: number
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
      supplyDecimals: supplyDecimals(listing.nftCollection ?? {}),
    }
  },

  fromSale(sale: Sale): Activity {
    return {
      source: 'sale',
      type: sale.listing?.side ?? 'unknown',
      chainId: sale.chainId,
      collection: sale.collection,
      tokenId: sale.tokenId,
      price: sale.price,
      timestamp: sale.timestamp,
      collectionSymbol: sale.nftCollection?.symbol ?? 'unknown',
    }
  },
}

const supplyDecimals = ({ totalSupply }: { totalSupply?: bigint }) => {
  if (!totalSupply) return undefined

  return String(totalSupply).length
}
