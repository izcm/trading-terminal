import Link from 'next/link'
import { ArrowLeftRight, Plus, RefreshCcw } from 'lucide-react'

import { CollectionFilters } from '@/components/organisms/sidebar-filters/CollectionFilters'
import { CollectionList } from '@/components/organisms/CollectionList'

import { getCollections } from '@/dev/collections'
import { Sidebar } from '@/components/organisms'
import { SidebarContainer } from '@/components/atoms'

export default async function BrowseCollectionsPage() {
  // TODO: update this to use https://www.alchemy.com/docs/reference/nft-api-endpoints/nft-api-endpoints/nft-metadata-endpoints/get-contract-metadata-batch-v-3

  // === NON DEMO STUFF ===
  // const alchemyCollections = (
  //   await Promise.all(
  //     demoCollections.map(async c => {
  //       const res = await getCollectionMetadata(c.address)
  //       return res.ok ? res.data : null
  //     })
  //   )
  // ).filter(c => c !== null)

  // if (alchemyCollections.length == 0) {
  //   return <div>Error fetching collections...</div>
  // }

  // const collections = alchemyCollections.map(c => {
  //   return toCollection(c)
  // })

  const collections = getCollections()

  return (
    <main className="flex gap-4 max-w-7xl mx-auto h-screen">
      <section className="basis-2/3 flex flex-col gap-4">
        {/* ORDERBOOK LATEST ORDERS */}
        <div className="flex-1 flex card">latest active orders</div>
        {/* COLLECTION LIST */}
        <div className="flex-1 flex list">collections</div>
      </section>

      <section className="basis-1/3 flex flex-col gap-4">
        <Link className="btn btn-primary" href="/create-order">
          <Plus /> create order
        </Link>
        <Link className="btn btn-secondary" href="/create-order">
          <ArrowLeftRight /> amm mode
        </Link>
        {/* SUBS */}
        <div className="rounded-xl card h-60">
          d|subs
          <p>
            (subscription service for users to watch sales of favourite nfts [not limited to dmrkt
            nfts])
          </p>
        </div>
        <div className="flex-1 rounded-xl card"></div>
      </section>
    </main>
  )
}
