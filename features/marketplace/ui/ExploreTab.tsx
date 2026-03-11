// todo: di here?
import { useState } from 'react'
import { Address } from 'viem'

import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
import { readNFTBatch } from '@/lib/blockchain/erc721/erc721.read'

import { Result } from '@/lib/utils/http'
import { getImageFromTokenURI } from '@/lib/utils/image'

import { NFT } from '@/domain/nft'

import { Tab, NFTCollectionsList } from '@/ui/organisms'
import { GalleryItem } from '@/ui/molecules'
import { TextInput } from '@/ui/atoms'

export type CollectionsProps = {
  initialItems: {
    nfts: NFT[]
    collections: NFTCollection[]
  }
  initialCursor: string | null
}

export function ExploreTab({ initialItems, initialCursor }: CollectionsProps) {
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

    return {
      ok: true,
      data: {
        items: batch.data.items.map(item => ({
          id: item.tokenId,
          tokenId: item.tokenId,
          tokenURI: item.tokenURI,
        })),
        nextCursor: batch.data.nextCursor,
      },
    }
  }

  return (
    <>
      <Tab<NFT>
        secondaryView={() => (
          <div className="flex flex-col gap-4">
            <NFTCollectionsList collections={initialItems.collections} flexDir="row" />
            <TextInput />
          </div>
        )}
        getGalleryItems={getGalleryItems}
        galleryItem={item => (
          <GalleryItem image={getImageFromTokenURI(item.tokenURI)} title={item.tokenId} />
        )}
        galleryView="card"
        initialItems={initialItems.nfts}
        initialCursor={initialCursor}
        sidePanel={() => <div>hello</div>}
      />
    </>
  )
}
