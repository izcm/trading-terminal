import { useTokenURI } from '@/lib/blockchain'

import { getDmrktListings } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { Listing } from '@/domain/listing'
import type { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

import { TradePanel } from '@/features/trade/ui/TradePanel'
import { activity } from '@/domain/shared/types/activity'

import { Tab } from '@/ui/organisms/core/Tab'
import { ActivityItem, ActivityRow } from '@/ui/molecules'
import { NFTCollectionsList } from '@/ui/organisms/NFTCollectionsList'
import { mapTokenUriToNFT } from '@/domain/nft'

export type FeedProps = {
  initialItems: {
    topCollections: NFTCollection[]
    listings: Listing[]
  }
  initialCursor: string | null
}

export function FeedTab({ initialItems, initialCursor }: FeedProps) {
  return (
    <Tab<Listing>
      getGalleryItems={getDmrktListings}
      galleryItem={item => <ActivityItem activity={activity.fromListing(item)} />}
      sidePanel={item => <TradePanel listing={item} />}
      initialItems={initialItems.listings}
      initialCursor={initialCursor}
    />
  )
}
