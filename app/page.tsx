import { getDmrktListings, getDmrktSales } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { MarketplaceView } from '@/features/marketplace/ui/MarketplaceView'

export default async function Page() {
  const listingCall = await getDmrktListings(25)
  const salesCall = await getDmrktSales(25)

  const feed = listingCall.ok
    ? { items: listingCall.data.items, cursor: listingCall.data.nextCursor }
    : { items: [], cursor: null }

  const sales = salesCall.ok
    ? { items: salesCall.data.items, cursor: salesCall.data.nextCursor }
    : { items: [], cursor: null }

  return <MarketplaceView feed={feed} sales={sales} />
}
