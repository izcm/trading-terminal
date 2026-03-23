import type { NFT } from '@/domain/nft'

import { ArrowList, NFTRow } from '@/ui/molecules'
import { ArrowRow } from '@/ui/atoms'

type Props = {
  nfts: NFT[]
  selectedId?: string
  onSelect: (nft: NFT) => void
}

export function NFTPicker({ nfts, onSelect, selectedId: selectedTokenId }: Props) {
  return (
    <div className="flex h-full min-h-0 gap-4 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col card border-soft bg-black/20">
        <ArrowList
          items={nfts}
          getId={nft => nft.tokenId.toString()}
          selectedId={selectedTokenId}
          onSelect={onSelect}
          className="min-h-0 flex-1 bg-primary"
        >
          {({ item, isSelected, onSelect }) => (
            <ArrowRow key={item.id} isSelected={isSelected} onSelect={onSelect}>
              <NFTRow nft={item} />
            </ArrowRow>
          )}
        </ArrowList>
      </div>
    </div>
  )
}
