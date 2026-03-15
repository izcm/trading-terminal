import { useState } from 'react'
import { Address } from 'viem'

import type { NFTCollection } from '@/domain/nft-collection'
import { readNFTBatch } from '@/lib/blockchain/erc721/erc721.read'
import { Result } from '@/lib/utils/http'

import { NFTCollectionBanner } from '@/features/explore/ui/NFTCollectionBanner'
import { NFTCard } from '@/ui/organisms/NFTCard'
import { NFTPanel } from '@/ui/organisms/SidePanel'

import { NFT } from '@/domain/nft'

import { NFTPreview, Gallery } from '@/ui/organisms'
import { GalleryItem, NFTRow } from '@/ui/molecules'
import { TextInput } from '@/ui/atoms'

export type ExploreProps = {
  initialItems: {
    nfts: NFT[]
    collections: NFTCollection[]
  }
  initialCursor: string | null
}

// what?

export function ExploreTab({ initialItems, initialCursor }: ExploreProps) {
  const [address, setAddress] = useState<Address | undefined>(
    initialItems.collections.length ? initialItems.collections[0].address : undefined
  )

  const getGalleryItems = async (
    limit: number,
    cursor: string
  ): Promise<Result<{ items: NFT[]; nextCursor: string | null }>> => {
    if (!address || !cursor || !/^\d+$/.test(cursor)) {
      return { ok: true, data: { items: [], nextCursor: null } }
    }

    const batch = await readNFTBatch(address, limit, Number(cursor))
    if (!batch.ok) return batch

    return batch
  }

  return (
    <>
      <Gallery<NFT>
        getGalleryItems={getGalleryItems}
        // galleryItem={item => (
        //   <div className="">
        //     <NFTCard nft={item} />
        //   </div>
        // )}
        items={item => <NFTRow nft={item} />}
        galleryView="list"
        sidePanel={item => (
          <div className="flex flex-col gap-2 h-full">
            {item && <NFTPanel nft={item} details={<div>hello</div>} />}
            <button className="btn btn-primary">make bid</button>
          </div>
        )}
        initialItems={initialItems.nfts}
        initialCursor={initialCursor}
      />
    </>
  )
}
