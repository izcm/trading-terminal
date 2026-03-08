import { Plus } from 'lucide-react'

import { ChainActivityProps } from '@/components/organisms/chain-activity/ChainActivity'
import { Feed } from '@/components/organisms/ListingMarketplace'

import { DMRKT_INDEXER_BASE_URL as baseUrl } from '@/lib/dmrkt-indexer/constants'
import { getListings } from '@/lib/dmrkt-indexer/actions/listings.get'
import { getSales } from '@/lib/dmrkt-indexer/actions/sales.get'
import { NFTCollection, TopNFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

import { ListingRow, TopCollectionRow } from '@/components/molecules'
import { getDmrktItems } from '@/lib/http/dmrkt.get'
import { Listing } from '@/lib/dmrkt-indexer/types/listing'

// https://nextjs.org/docs/app/getting-started/error-handling

export const views = {
  feed: {
    id: 'feed',
    title: 'feed',
    header: (
      <button className="btn btn-secondary self-end">
        <Plus /> create order
      </button>
    ),
  },
}

export default async function Page() {
  /* feed */

  let feedProps

  {
    const colRes = await fetch(`${baseUrl}/api/nft-collections/top?chainId=31337&limit=3`, {
      cache: 'no-store',
    })

    const collections = (await colRes.json()) as TopNFTCollection[]

    const listingRes = await getDmrktItems<Listing>(
      'orders',
      'limit=50&status=active&include=nftCollection',
      null
    )

    feedProps = listingRes.ok
      ? {
          collections,
          initialListings: listingRes.data.items,
          initialCursor: listingRes.data.nextCursor,
        }
      : { collections: [], initialListings: [], initialCursor: null }
  }

  /* chain activity */

  let caProps: ChainActivityProps

  {
    const res = await getSales('limit=100&include=nftCollection&include=order')

    caProps = res.ok
      ? { initialSales: res.data.items, initialCursor: res.data.nextCursor }
      : { initialSales: [], initialCursor: null }
  }

  return (
    <>
      <Feed
        header={views['feed'].header}
        initialItems={feedProps.initialListings}
        initialCursor={feedProps.initialCursor}
      />
    </>
  )
}
