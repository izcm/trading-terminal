import { useEffect, useState } from 'react'

import { getTokensByOwner } from '@/lib/blockchain/erc721/erc721.read'

import type { NFT } from '@/domain/nft'
import type { Hex } from '@/domain/shared/eth'

import { ArrowList, NFTRow } from '@/ui/molecules'
import { ArrowRow } from '@/ui/atoms'

type Props = {
  chainId: number
  collection: Hex
  user: Hex
  selectedId?: string
  onSelect: (nft: NFT) => void
}

export function OwnedNFTPicker({
  chainId,
  collection,
  user,
  onSelect,
  selectedId: selectedTokenId,
}: Props) {
  // todo: user context with nfts?
  const [nfts, setNfts] = useState<NFT[]>([])

  useEffect(() => {
    if (!user) return
    const readTokens = async () => {
      console.log(collection)

      const res = await getTokensByOwner(user, collection)

      if (res.ok) setNfts(res.data)
    }
    readTokens()
  }, [user, collection, chainId])

  useEffect(() => {
    if (!selectedTokenId && nfts.length > 0) {
      onSelect(nfts[0])
    }
  }, [nfts, selectedTokenId])

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
