import type { Hex } from '@/domain/shared/eth'

import {
  getDmrktListings,
  getDmrktNFTs,
  getDmrktSales,
} from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

import { MarketplaceView } from '@/features/MarketplaceView'
import { IndexingGate } from '@/features/IndexingGate'

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

  const listingCall = await getDmrktListings({
    filters: { status: ['active'], ...baseFilters },
  })
  const salesCall = await getDmrktSales({ filters: baseFilters })
  const exploreCall = await getDmrktNFTs({ filters: baseFilters })

  const feed = listingCall.ok
    ? { items: listingCall.data.items, cursor: listingCall.data.cursor }
    : { items: [], cursor: null }

  const sales = salesCall.ok
    ? { items: salesCall.data.items, cursor: salesCall.data.cursor }
    : { items: [], cursor: null }

  const explore = exploreCall.ok
    ? { items: exploreCall.data.items, cursor: exploreCall.data.cursor }
    : { items: [], cursor: null }

  return (
    <MarketplaceView
      feed={feed}
      sales={sales}
      explore={explore}
      chainId={Number(chainId)}
      collection={collection as Hex}
    />
  )
}
