'use client'

import Link from 'next/link'

import { NFT } from '@/domain/types/nft'
import { NFTCard } from '../molecules/cards/NFTCard'

interface NFTGalleryProps {
  nfts: NFT[]
  baseUrl: string
}

export function NFTGallery({ nfts, baseUrl }: NFTGalleryProps) {
  return (
    <ul
      className="
        grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4
        card 
        "
    >
      {nfts.map((nft, i) => (
        <li key={`${nft.contract}-${nft.tokenId}-${i}`}>
          <Link
            href={`${baseUrl}/${nft.tokenId}`}
            className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg block"
          >
            <NFTCard nft={nft} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
