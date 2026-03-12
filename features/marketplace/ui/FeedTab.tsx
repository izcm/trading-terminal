// todo: decouple
import { getDmrktListings } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { Listing } from '@/lib/dmrkt-indexer/types/listing'
import type { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

import { TradePanel } from '@/features/trade/ui/TradePanel'
import { activity } from '@/domain/shared/types/activity'

import { Tab } from '@/ui/organisms/core/Tab'
import { ActivityRow } from '@/ui/molecules'
import { NFTCollectionsList } from '@/ui/organisms/NFTCollectionsList'

export type FeedProps = {
  initialItems: {
    topCollections: NFTCollection[]
    listings: Listing[]
  }
  initialCursor: string | null
}

export function FeedTab({ initialItems, initialCursor }: FeedProps) {
  return (
    <>
      <Tab<Listing>
        secondaryView={() => <NFTCollectionsList collections={initialItems.topCollections} />}
        getGalleryItems={getDmrktListings}
        galleryItem={item => <ActivityRow activity={activity.fromListing(item)} />}
        sidePanel={item => <TradePanel listing={item} />}
        initialItems={initialItems.listings}
        initialCursor={initialCursor}
      />
    </>
  )
}
