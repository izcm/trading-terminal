import { ReactNode } from 'react'

import { NFT } from '@/domain/nft'
import { NFTCard } from './NFTCard'

type PanelProps = {
  nft: NFT
  details: ReactNode
}

export function NFTPanel({ nft, details }: PanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="pointer-events-none">
        <NFTCard nft={nft} />
      </div>
      <div className="flex flex-col gap-2 my-1">
        <button>hello</button>
      </div>
      {details}
    </div>
  )
}
