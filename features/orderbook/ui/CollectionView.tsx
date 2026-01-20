'use client'

import Link from 'next/link'
import { Search, ChartArea } from 'lucide-react'

import { NFTGallery, Sidebar } from '@/components/organisms'
import { SidebarContainer, TextInput } from '@/components/atoms'

import { AttributeSummary, Collection, NFT } from '@/domain/types'
import { CollectionBanner } from '@/components/molecules/CollectionBanner'
import { useState } from 'react'

interface CollectionViewProps {
  collection: Collection
  nfts: NFT[]
  attributes?: AttributeSummary
}

export const CollectionView = ({ collection, nfts, attributes: traits }: CollectionViewProps) => {
  const [filters, setFilters] = useState({
    traits: {},
  })

  const contract = collection.address
  const baseUrl = `/collection/${contract}`

  const traitsAsArray = Object.entries(traits ?? {})

  return (
    <div className="flex flex-col gap-4">
      <CollectionBanner collection={collection} />

      {/* SEARCH INPUT AND LINKS */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <TextInput />
        </div>

        <Link href={`${contract}/create-order`}>
          <button className="btn btn-primary px-6">make collection bid</button>
        </Link>

        <Link
          href={`/collection/${contract}/analytics`}
          className="
            btn btn-secondary
          "
        >
          <ChartArea /> view analytics
        </Link>
      </div>

      {/* SIDEBAR */}
      <div className="flex gap-4">
        <aside
          className="w-[400px] sticky top-2 overflow-scroll scrollbar-hide"
          style={{ height: 'calc(100vh - 16px)' }}
        >
          <div className="flex flex-col gap-4 h-full">
            {/* LATEST ACTIVITY */}
            <div className="card h-80"></div>
            <div className="card flex-1"></div>
          </div>
        </aside>

        {/* NFT GALLERY */}
        <main id="main" tabIndex={-1} className="w-full">
          <NFTGallery nfts={nfts} baseUrl={baseUrl} />
        </main>
      </div>
    </div>
  )
}
