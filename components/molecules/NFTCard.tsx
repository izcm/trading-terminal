'use client'

import { useEffect, useState } from 'react'
import { NFT } from '@/domain/types/nft'
import { resolveImage } from '@/lib/utils/image'

export const NFTCard = ({ nft }: { nft: NFT }) => {
  const [src, setSrc] = useState<string>(nft.image)

  useEffect(() => {
    resolveImage(nft.image).then(setSrc)
  }, [nft.image])

  return (
    <div className="group card overflow-hidden hover:-translate-y-1 transition-transform">
      <div className="aspect-square bg-muted/10">
        <img src={src} alt={nft.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 border-t border-default">
        <div className="truncate group-hover:text-accent transition-colors">{nft.name}</div>
      </div>
    </div>
  )
}
