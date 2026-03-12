import { useEffect, useState } from 'react'

// todo: di?
import { useTokenURI } from '@/lib/blockchain'

import { Hex } from '@/domain/shared/types/eth'
import { mapTokenUriToNFT, NFT, parseTokenURI } from '@/domain/nft'

import { NFTCard } from '@/ui/organisms/NFTCard'

type NFTAttribute = {
  trait_type: string
  value: string
}

type Props = {
  chainId: number
  address: Hex
  tokenId?: string
}

export function NFTPreview({ chainId, address, tokenId }: Props) {
  // UI elements
  const [nft, setNft] = useState<NFT>()

  const { data: tokenURI } = useTokenURI(
    tokenId
      ? {
          chainId,
          address,
          tokenId: BigInt(tokenId),
        }
      : undefined
  )

  useEffect(() => {
    if (!tokenURI || !tokenId) return

    const preview = async () => {
      setNft(mapTokenUriToNFT(chainId, address, tokenId, tokenURI))
    }

    preview()
  }, [tokenURI])

  return <NFTCard nft={nft} />
}
