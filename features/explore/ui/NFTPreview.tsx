import { useEffect, useState } from 'react'

// todo: di?
import { useTokenURI } from '@/lib/blockchain'

import { Hex } from '@/domain/shared/eth'
import { mapTokenUriToNFT, NFT, parseTokenURI } from '@/domain/nft'

import { NFTCard } from '@/ui/organisms/NFTCard'

type Props = {
  chainId?: number
  address?: Hex
  tokenId?: bigint
  pointerEvents?: boolean
}

export function NFTPreview({ chainId, address, tokenId, pointerEvents = false }: Props) {
  // UI elements
  const [nft, setNft] = useState<NFT>()

  const enabled = !!chainId && !!address && !!tokenId

  const { data: tokenURI } = useTokenURI(
    enabled
      ? {
          chainId,
          address,
          tokenId,
        }
      : undefined
  )

  useEffect(() => {
    if (!enabled || !tokenURI) return

    const preview = async () => {
      setNft(mapTokenUriToNFT(chainId, address, tokenId, tokenURI))
    }

    preview()
  }, [tokenURI])

  const classPointerEvents = pointerEvents ? '' : 'pointer-events-none'

  return (
    <div className={`${classPointerEvents}`}>
      <NFTCard nft={nft} />
    </div>
  )
}
