// todo: have these imported in centralized place (don't depend on lucide-react)
import { Plus } from 'lucide-react'

// todo: decouple
import { getDmrktListings } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import { Listing } from '@/lib/dmrkt-indexer/types/listing'
import { TopNFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

import { TradePanel } from '@/features/trade/ui/TradePanel'

import { Tab, TabUIProps } from '@/ui/organisms/core/Tab'
import { ArrowList, ListingRow, TopCollectionRow } from '@/ui/molecules'
import { ArrowRow } from '@/ui/atoms'

function TopCollectionsList({ collections }: { collections: TopNFTCollection[] }) {
  return (
    <ArrowList
      items={collections}
      getId={(c: TopNFTCollection) => c.id}
      selectedId={undefined}
      onSelect={() => alert('hello')}
      className="shrink-0"
    >
      {({ item, isSelected, onSelect }) => (
        <ArrowRow key={item.id} isSelected={isSelected} onSelect={onSelect} className="p-1">
          <TopCollectionRow collection={item} />
        </ArrowRow>
      )}
    </ArrowList>
  )
}

const mode: Omit<TabUIProps<Listing>, 'secondaryView'> = {
  getGalleryItems: getDmrktListings,
  galleryItem: item => <ListingRow listing={item} />,
  sidePanel: item => {
    return (
      <div className="flex flex-col h-full gap-4">
        <button className="btn btn-secondary">
          <Plus /> make new order
        </button>
        <TradePanel listing={item} />
      </div>
    )
  },
}

export type FeedProps = {
  initialItems: {
    topCollections: TopNFTCollection[]
    listings: Listing[]
  }
  initialCursor: string | null
}

export function FeedTab({ initialItems, initialCursor }: FeedProps) {
  return (
    <>
      <Tab<Listing>
        secondaryView={<TopCollectionsList collections={initialItems.topCollections} />}
        getGalleryItems={mode.getGalleryItems}
        galleryItem={mode.galleryItem}
        sidePanel={mode.sidePanel}
        initialItems={initialItems.listings}
        initialCursor={initialCursor}
      />
    </>
  )
}
