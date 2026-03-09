import { DMRKT_INDEXER_BASE_URL as baseUrl } from '@/lib/dmrkt-indexer/constants'
import { TopNFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
import { getDmrktListings, getDmrktSales } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { MarketplaceView } from '@/features/marketplace/ui/MarketplaceView'

export default async function Page() {
  /* feed */

  let feedProps

  {
    let colRes = await fetch(`${baseUrl}/api/nft-collections/top?chainId=31337&limit=3`, {
      cache: 'no-store',
    })

    const collections = (await colRes.json()) as TopNFTCollection[]

    const listingRes = await getDmrktListings(25) // get initial

    feedProps = listingRes.ok
      ? {
          initialItems: {
            listings: listingRes.data.items,
            topCollections: collections,
          },
          initialCursor: listingRes.data.nextCursor,
        }
      : { initialItems: { listings: [], topCollections: [] }, initialCursor: null }
  }

  /* chain activity */

  let salesProps

  {
    const res = await getDmrktSales(25)

    salesProps = res.ok
      ? { initialItems: res.data.items, initialCursor: res.data.nextCursor }
      : { initialItems: [], initialCursor: null }
  }

  return <MarketplaceView feedProps={feedProps} salesProps={salesProps} initialView="feed" />
}
