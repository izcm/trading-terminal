import type { Page, Result } from '@/lib/utils/http'
import {
  getDmrktListings,
  getDmrktSales,
  getDmrktNFTs,
} from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

import type { Listing } from '@/domain/listing'
import type { Sale } from '@/domain/sale'
import type { NFT } from '@/domain/nft'

import { activity } from '@/domain/shared/activity'

import { ActivityItem, NFTRow } from '@/ui/molecules'

import { ListingDetails } from './browse/ui/ListingDetails'
import { SaleDetails } from './browse/ui/SaleDetails'
import { TradeBtn } from './trade/ui/TradeBtn'
import { ReactNode } from 'react'

export type TabResource = {
  feed: Listing
  explore: NFT
  sales: Sale
}

export type TabName = keyof TabResource

type PageGetters<K extends keyof TabResource> = (
  filters: Record<string, string>
) => Promise<Result<Page<TabResource[K]>>>

export const pageGetters: { [K in keyof TabResource]: PageGetters<K> } = {
  feed: getDmrktListings,
  sales: getDmrktSales,
  explore: getDmrktNFTs,
}

type TabUIConfig = {
  [K in TabName]: {
    galleryItem: (item: TabResource[K]) => ReactNode
    details?: (item: TabResource[K]) => ReactNode
    mainActionBtn: (item: TabResource[K]) => ReactNode
  }
}

export const tabUIConfig: TabUIConfig = {
  feed: {
    galleryItem: (item: Listing) => <ActivityItem activity={activity.fromListing(item)} />,
    details: (item: Listing) => <ListingDetails listing={item} />,
    mainActionBtn: (item: Listing) => <TradeBtn listing={item} />,
  },

  explore: {
    galleryItem: (item: NFT) => <NFTRow nft={item} />,
    details: () => <div>placeholder</div>,
    mainActionBtn: () => <button className="btn btn-secondary">view full receipt</button>,
  },

  sales: {
    galleryItem: (item: Sale) => <ActivityItem activity={activity.fromSale(item)} />,
    details: (item: Sale) => <SaleDetails sale={item} />,
    mainActionBtn: () => <button className="btn btn-secondary">view full receipt</button>,
  },
}
