'use client'

import { useEffect, useState } from 'react'

import type { Hex } from '@/domain/shared/eth'

import { NFTPreview } from '@/features/explore/ui/NFTPreview'
import { ArrowRow } from '@/ui/atoms'
import { getTokensByOwner } from '@/lib/blockchain/erc721/erc721.read'
import { useAccount } from 'wagmi'
import { NFT } from '@/domain/nft'
import { ArrowList, NFTRow } from '@/ui/molecules'

type Props = {
  chainId: number
  collection: Hex
  validation: {
    canConfirm: boolean
    checking: boolean
    error?: string
  }
  onValidate: (tokenId: bigint) => void
  onConfirm: () => void
}

// menu for selecting nft for collection_bid ( cb )
export function CbFillMenu({ chainId, collection, validation, onValidate, onConfirm }: Props) {
  const { address: userAddr } = useAccount()

  const [nfts, setNfts] = useState<NFT[]>([])
  const [tokenId, setTokenId] = useState<bigint | undefined>(undefined)

  useEffect(() => {
    if (!userAddr) return
    console.log('HELLO')
    const readTokens = async () => {
      const res = await getTokensByOwner(userAddr, collection)

      if (res.ok) setNfts(res.data)
    }

    readTokens()
    console.log('read it!')
  }, [userAddr, collection, chainId])

  useEffect(() => {
    if (tokenId !== undefined || nfts.length === 0) return
    setTokenId(nfts[0].tokenId)
    onValidate(nfts[0].tokenId)
  }, [nfts, tokenId, onValidate])

  const selectedNftId =
    tokenId === undefined ? nfts[0]?.id : nfts.find(nft => nft.tokenId === tokenId)?.id

  const handleSelect = (nft: NFT) => {
    setTokenId(nft.tokenId)
    onValidate(nft.tokenId)
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-[465px] max-w-[600px] gap-4 p-1">
        <div className="basis-1/3 self-center pointer-events-none bg-black/20">
          <NFTPreview chainId={chainId} address={collection} tokenId={tokenId} />
        </div>

        <div className="flex-1 card bg-black/20">
          <ArrowList
            items={nfts}
            getId={nft => nft.id}
            selectedId={selectedNftId}
            onSelect={handleSelect}
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

      {validation.error && <p className="text-sm text-red-400">{validation.error}</p>}

      <button
        disabled={!tokenId || validation.checking || !validation.canConfirm}
        onClick={onConfirm}
        className="btn btn-primary"
      >
        {validation.checking ? 'checking...' : 'fill order'}
      </button>
    </div>
  )
}
