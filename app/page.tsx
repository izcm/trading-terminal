import {
  getDmrktListings,
  getDmrktNFTs,
  getDmrktSales,
} from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

import { MarketplaceView } from '@/features/MarketplaceView'

export default async function Page() {
  const listingCall = await getDmrktListings()
  const salesCall = await getDmrktSales()
  const exploreCall = await getDmrktNFTs()

  const feed = listingCall.ok
    ? { items: listingCall.data.items, cursor: listingCall.data.cursor }
    : { items: [], cursor: null }

  const sales = salesCall.ok
    ? { items: salesCall.data.items, cursor: salesCall.data.cursor }
    : { items: [], cursor: null }

  const explore = exploreCall.ok
    ? { items: exploreCall.data.items, cursor: exploreCall.data.cursor }
    : { items: [], cursor: null }

  return <MarketplaceView feed={feed} sales={sales} explore={explore} />
}
