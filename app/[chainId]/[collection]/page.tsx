import { getDmrktNFTCollection } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import {
  getDmrktListings,
  getDmrktNFTs,
  getDmrktSettlements as getDmrktTrades,
} from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

import { MarketplaceView } from '@/features/MarketplaceView'
import { unwrap } from '@/lib/utils/http'

export default async function Page({
  params,
}: {
  params: Promise<{ chainId: string; collection: string }>
}) {
  const { chainId, collection } = await params

  const baseFilters = { chainId: [chainId], collection: [collection] }

  const [nftCall, listingCall, tradeCall, collectionCall] = await Promise.all([
    getDmrktNFTs({ filters: baseFilters }),
    getDmrktListings({ filters: { ...baseFilters, status: ['active'] } }),
    getDmrktTrades({ filters: baseFilters }),
    getDmrktNFTCollection(Number(chainId), collection),
  ])

  if ([nftCall, listingCall, tradeCall, collectionCall].some(r => !r.ok)) {
    return (
      <div className="h-screen flex items-center justify-center font-mono text-sm text-muted">
        <div>error loading page</div>
      </div>
    )
  }

  return (
    <MarketplaceView
      collection={unwrap(collectionCall)}
      initialPages={{
        feed: unwrap(listingCall),
        explore: unwrap(nftCall),
        trades: unwrap(tradeCall),
      }}
    />
  )
}
