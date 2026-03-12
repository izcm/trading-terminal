// todo: di here?
import { useState } from 'react'
import { Address } from 'viem'

import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
import { readNFTBatch } from '@/lib/blockchain/erc721/erc721.read'

import { Result } from '@/lib/utils/http'
import { getImageFromTokenURI } from '@/lib/utils/image'

import { NFT } from '@/domain/nft'

import { Tab, NFTCollectionsList, NFTPreview } from '@/ui/organisms'
import { GalleryItem } from '@/ui/molecules'
import { TextInput } from '@/ui/atoms'
import { SidePanel } from '@/ui/organisms/SidePanel'
import { NFTCollectionBanner } from '@/features/explore/ui/NFTCollectionBanner'

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
          chainId: item.chainId,
          collection: item.collection,
        })),
        nextCursor: batch.data.nextCursor,
      },
    }
  }

  return (
    <>
      <Tab<NFT>
        secondaryView={() => (
          <div className="flex flex-col gap-4 h-[150px]">
            <NFTCollectionBanner collection={initialItems.collections[0]} />
            <div className="flex gap-4">
              <TextInput />
              <button className="basis-1/3 btn btn-secondary">make collection bid</button>
            </div>
          </div>
        )}
        getGalleryItems={getGalleryItems}
        galleryItem={item => (
          <GalleryItem image={getImageFromTokenURI(item.tokenURI)} title={item.tokenId} />
        )}
        galleryView="card"
        sidePanel={item => (
          <div className="flex flex-col gap-2 h-full">
            <div className="card">
              {item && (
                <NFTPreview
                  chainId={item.chainId}
                  address={item.collection}
                  tokenId={item.tokenId}
                />
              )}
            </div>
            <div className="flex flex-col gap-2 my-1">
              <button className="btn btn-secondary">open receipt 2.0</button>
              <span className="text-xs text-muted">gas costs, tx inputs etc.</span>
            </div>
            -
          </div>
        )}
        initialItems={initialItems.nfts}
        initialCursor={initialCursor}
      />
    </>
  )
}
