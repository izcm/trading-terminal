import { activity } from '@/domain/shared/activity'
import type { Listing } from '@/domain/listing'
import type { Sale } from '@/domain/sale'

import { ActivityItem, NFTRow } from '@/ui/molecules'
import { ListingDetails } from './browse/ui/ListingDetails'
import { SaleDetails } from './browse/ui/SaleDetails'
import { TradeBtn } from './trade/ui/TradeBtn'

export function makeViewConfig(simulation: { isFillable: boolean }) {
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
