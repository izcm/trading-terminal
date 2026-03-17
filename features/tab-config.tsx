import type { Page, Result } from '@/lib/utils/http'

import { activity } from '@/domain/shared/activity'
import type { Listing } from '@/domain/listing'
import type { Sale } from '@/domain/sale'

import { ActivityItem, NFTRow } from '@/ui/molecules'

import { ListingDetails } from './browse/ui/ListingDetails'
import { SaleDetails } from './browse/ui/SaleDetails'
import { TradeBtn } from './trade/ui/TradeBtn'
import { getDmrktListings, getDmrktSales } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

export type TabResource = {
  feed: Listing
  sales: Sale
  // explore: NFT
}

export type TabName = keyof TabResource

type PageGetters<K extends keyof TabResource> = (
  limit: number,
  cursor: string | null
) => Promise<Result<Page<TabResource[K]>>>

export const pageGetters: { [K in keyof TabResource]: PageGetters<K> } = {
  feed: getDmrktListings,
  sales: getDmrktSales,
  // explore: getDmrktCollections,
}

export function makeTabUiConfig(simulation: { isFillable: boolean }) {
  return {
    feed: {
      galleryItem: (item: Listing) => <ActivityItem activity={activity.fromListing(item)} />,

      details: (item: Listing) => <ListingDetails listing={item} />,

      mainActionBtn: (item: Listing) => (
        <TradeBtn listing={item} disabled={!simulation.isFillable && !item.isCollectionBid} />
      ),
    },

    sales: {
      galleryItem: (item: Sale) => <ActivityItem activity={activity.fromSale(item)} />,

      details: (item: Sale) => <SaleDetails sale={item} />,

      mainActionBtn: () => <button className="btn btn-secondary">view full receipt</button>,
    },
  }
}
