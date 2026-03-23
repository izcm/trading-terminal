'use client'

import { useState } from 'react'

import type { Hex } from '@/domain/shared/eth'
import type { NFT } from '@/domain/nft'

import { NFTPicker } from '@/ui/organisms/NFTPicker'

type Props = {
  chainId: number
  collection: Hex
  user: Hex

  validation: {
    canConfirm: boolean
    checking: boolean
    error?: string
  }

  onValidate: (tokenId: bigint) => void
  onConfirm: () => void
}

// menu for selecting nft for collection_bid ( cb )
export function CbFillMenu({
  chainId,
  collection,
  user,
  validation,
  onValidate,
  onConfirm,
}: Props) {
  const [tokenId, setTokenId] = useState<bigint | undefined>(undefined)

  const handleSelect = (nft: NFT) => {
    setTokenId(nft.tokenId)
    onValidate(nft.tokenId)
  }

  return (
    <div className="flex flex-col gap-4 max-h-[500px]">
      <NFTPicker
        chainId={chainId}
        collection={collection}
        user={user}
        selectedId={tokenId?.toString()}
        onSelect={handleSelect}
      />

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
