// todo: decouple
import { getDmrktListings } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { Listing } from '@/lib/dmrkt-indexer/types/listing'

import { TradePanel } from '@/features/trade/ui/TradePanel'
import { activity } from '@/domain/shared/types/activity'

import { Tab, TabUIProps } from '@/ui/organisms/core/Tab'
import { ArrowList, ActivityRow, NFTCollectionRow } from '@/ui/molecules'
import { ArrowRow } from '@/ui/atoms'
import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
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
