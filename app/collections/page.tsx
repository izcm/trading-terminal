import Link from 'next/link'
import { ArrowLeftRight, Plus, LayoutGrid } from 'lucide-react'

import { CollectionFilters } from '@/components/organisms/sidebar-filters/CollectionFilters'
import { CollectionList } from '@/components/organisms/CollectionList'

import { getCollections } from '@/dev/collections'
import { Sidebar } from '@/components/organisms'
import { SidebarContainer } from '@/components/atoms'

export default async function BrowseCollectionsPage() {
  const collections = getCollections()

  return (
    <main className="flex flex-col gap-4 max-w-7xl mx-auto h-screen">
      {/* TOP SECTION - NAV + TABS */}
      <section className="flex justify-between items-center">
        <Link className="btn btn-ghost" href="/create-order">
          <ArrowLeftRight /> amm mode
        </Link>
        <h1 className="flex-1">d | feed</h1>
        <div className="flex gap-4">
          <Link className="btn btn-primary" href="/create-order">
            <Plus /> create order
          </Link>
          <Link className="btn btn-secondary" href="/create-order">
            <LayoutGrid /> browse collections
          </Link>
        </div>
      </section>
      <div className="flex-1 flex flex-col gap-4">
        {/* COLLECTION LIST */}
        <section className="h-80 flex gap-4">
          <ul className="flex-2 card list">
            <li>
              MAKE A COLLECTION LIST HERE RANKED MOST ORDERS ACTIVE ONCLICK FILTER HAVE ROUTER PUSH
              URL PARAM AND LATEST ACTIVE ORDERS LIST UNDERNEATH SHOWS ORDERS BY COLLECTION
            </li>
          </ul>
          <ul className="flex-1 card list">
            <li>
              MAKE A CAROSEL HERE WITH NFT COLLECTION BANNER IMAGE AND NAME IF URL PARAMS ARE SET
              SHOW THE ACTIVE COLLECTION ALSO HAVE A BUTTON 'BROWSE COLLECTON'
            </li>
          </ul>
        </section>

        {/* ORDERBOOK LATEST ORDERS */}
        <section className="flex-1 flex card">latest active orders</section>
      </div>
    </main>
  )
}
