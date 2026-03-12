import { useTokenURI } from '@/lib/blockchain'

import { getDmrktListings } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { Listing } from '@/lib/dmrkt-indexer/types/listing'
import type { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

import { TradePanel } from '@/features/trade/ui/TradePanel'
import { activity } from '@/domain/shared/types/activity'

import { Tab } from '@/ui/organisms/core/Tab'
import { ActivityRow } from '@/ui/molecules'
import { NFTCollectionsList } from '@/ui/organisms/NFTCollectionsList'
import { mapTokenUriToNFT } from '@/domain/nft'

export type FeedProps = {
  initialItems: {
    topCollections: NFTCollection[]
    listings: Listing[]
  }
  initialCursor: string | null
}

function ActivityItem({ listing }: { listing: Listing }) {
  const act = activity.fromListing(listing)

  const { chainId, collection, tokenId } = listing

  const { data: tokenURI } = useTokenURI({
    chainId,
    address: listing.collection,
    tokenId: BigInt(tokenId),
  })

  const nft = tokenURI ? mapTokenUriToNFT(chainId, collection, tokenId, tokenURI) : undefined

  return <ActivityRow item={{ activity: act, nft }} />
}

export function FeedTab({ initialItems, initialCursor }: FeedProps) {
  return (
    <>
      <Tab<Listing>
        secondaryView={() => <NFTCollectionsList collections={initialItems.topCollections} />}
        getGalleryItems={getDmrktListings}
        galleryItem={item => <ActivityItem listing={item} />}
        sidePanel={item => <TradePanel listing={item} />}
        initialItems={initialItems.listings}
        initialCursor={initialCursor}
      />
    </>
  )
}
