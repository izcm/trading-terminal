import {
  getDmrktListings,
  getDmrktNFTs,
  getDmrktSales,
} from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'
import { getDmrktNFTCollection } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { MarketplaceView } from '@/features/MarketplaceView'

export default async function Page({
  params,
}: {
  params: { chainId: string; collection: string }
}) {
  const { chainId, collection } = await params

  const baseFilters = {
    chainId: ['31337'],
    collection: [collection],
  }

  const [listingCall, salesCall, exploreCall, collectionCall] = await Promise.all([
    getDmrktListings({ filters: { status: ['active'], ...baseFilters } }),
    getDmrktSales({ filters: baseFilters }),
    getDmrktNFTs({ filters: baseFilters }),
    getDmrktNFTCollection(Number(chainId), collection),
  ])

  const feed = listingCall.ok
    ? { items: listingCall.data.items, cursor: listingCall.data.cursor }
    : { items: [], cursor: null }

  const sales = salesCall.ok
    ? { items: salesCall.data.items, cursor: salesCall.data.cursor }
    : { items: [], cursor: null }

  const explore = exploreCall.ok
    ? { items: exploreCall.data.items, cursor: exploreCall.data.cursor }
    : { items: [], cursor: null }

  if (!collectionCall.ok) {
    return (
      <div className="h-screen flex items-center justify-center font-mono text-sm text-muted">
        error fetching nft collection: {collectionCall.error}
      </div>
    )
  }

  return (
    <MarketplaceView feed={feed} sales={sales} explore={explore} collection={collectionCall.data} />
  )
}
