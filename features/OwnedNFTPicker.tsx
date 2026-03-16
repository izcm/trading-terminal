import { useEffect, useState } from 'react'

import { getTokensByOwner } from '@/lib/blockchain/erc721/erc721.read'

import type { NFT } from '@/domain/nft'
import type { Hex } from '@/domain/shared/eth'

import { NFTPreview } from '@/ui/organisms'
import { ArrowList, NFTRow } from '@/ui/molecules'
import { ArrowRow } from '@/ui/atoms'

type Props = {
  chainId: number
  collection: Hex
  user: Hex
  selectedTokenId?: bigint
  onSelect: (nft: NFT) => void
}

export function OwnedNFTPicker({ chainId, collection, user, onSelect, selectedTokenId }: Props) {
  // todo: user context with nfts?
  const [nfts, setNfts] = useState<NFT[]>([])
  const [fuck, setFuck] = useState<bigint | undefined>(undefined)

  useEffect(() => {
    if (!user) return
    const readTokens = async () => {
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
    <div className="flex max-h-[500px] max-w-[700px] gap-4 p-1">
      <div className="basis-1/3 self-center pointer-events-none bg-black/20">
        <NFTPreview chainId={chainId} address={collection} tokenId={selectedTokenId} />
      </div>

      <div className="flex-1 card bg-black/20">
        <ArrowList
          items={nfts}
          getId={nft => nft.tokenId.toString()}
          selectedId={selectedTokenId?.toString()}
          onSelect={onSelect}
          className="h-full bg-primary"
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
