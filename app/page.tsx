import { getDmrktListings, getDmrktSales } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

import { MarketplaceView } from '@/features/MarketplaceView'

export default async function Page() {
  const listingCall = await getDmrktListings()
  const salesCall = await getDmrktSales()

  const feed = listingCall.ok
    ? { items: listingCall.data.items, cursor: listingCall.data.cursor }
    : { items: [], cursor: null }

  const sales = salesCall.ok
    ? { items: salesCall.data.items, cursor: salesCall.data.cursor }
    : { items: [], cursor: null }

  return <MarketplaceView feed={feed} sales={sales} />
}
