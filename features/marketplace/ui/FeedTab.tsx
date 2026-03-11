// todo: decouple
import { getDmrktListings } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { Listing } from '@/lib/dmrkt-indexer/types/listing'

import { TradePanel } from '@/features/trade/ui/TradePanel'
import { activity } from '@/domain/shared/types/activity'

import { Tab, TabUIProps } from '@/ui/organisms/core/Tab'
import { ArrowList, ActivityRow, NFTCollectionRow } from '@/ui/molecules'
import { ArrowRow } from '@/ui/atoms'
import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

export type FeedProps = {
  initialItems: {
    topCollections: NFTCollection[]
    listings: Listing[]
  }
  initialCursor: string | null
}

function TopCollectionsList({ collections }: { collections: NFTCollection[] }) {
  return (
    <ArrowList
      items={collections}
      getId={(c: NFTCollection) => c.id}
      selectedId={undefined}
      onSelect={() => alert('hello')}
      className="shrink-0"
    >
      {({ item, isSelected, onSelect }) => (
        <ArrowRow
          key={item.id}
          isSelected={isSelected}
          onSelect={onSelect}
          className="base-row rounded-md transition gap-4 p-1 flex justify-between w-full"
        >
          <NFTCollectionRow collection={item} />
        </ArrowRow>
      )}
    </ArrowList>
  )
}

export function FeedTab({ initialItems, initialCursor }: FeedProps) {
  return (
    <>
      <Tab<Listing>
        secondaryView={() => <TopCollectionsList collections={initialItems.topCollections} />}
        getGalleryItems={getDmrktListings}
        galleryItem={item => <ActivityRow activity={activity.fromListing(item)} />}
        sidePanel={item => <TradePanel listing={item} />}
        initialItems={initialItems.listings}
        initialCursor={initialCursor}
      />
    </>
  )
}
