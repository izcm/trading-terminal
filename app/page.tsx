import { DMRKT_INDEXER_BASE_URL as baseUrl } from '@/lib/dmrkt-indexer/constants'
import {
  getDmrktCollections,
  getDmrktListings,
  getDmrktSales,
} from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { MarketplaceView } from '@/features/marketplace/ui/MarketplaceView'
import { readNFTBatch } from '@/lib/blockchain/erc721/erc721.read'
import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

export default async function Page() {
  /* feed */

  let feedProps

  {
    let colRes = await fetch(`${baseUrl}/api/nft-collections/top?chainId=31337&limit=3`, {
      cache: 'no-store',
    })

    const collections = (await colRes.json()) as NFTCollection[]

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

  /* collections browse */

  let collectionsProps

  {
    const colRes = await getDmrktCollections(10)
    if (!colRes.ok) {
      collectionsProps = { initialItems: { collections: [], nfts: [] }, initialCursor: null }
    } else {
      const collections = colRes.data.items
      const nftRes = collections.length
        ? await readNFTBatch(collections[0].address, 25)
        : {
            ok: true as const,
            data: { items: [], nextCursor: null },
          }

      collectionsProps = {
        initialItems: {
          collections,
          nfts: nftRes.ok ? nftRes.data.items : [],
        },
        initialCursor: colRes.data.nextCursor,
      }
    }
  }

  return (
    <MarketplaceView
      feedProps={feedProps}
      salesProps={salesProps}
      collectionsProps={collectionsProps}
      initialView="feed"
    />
  )
}
