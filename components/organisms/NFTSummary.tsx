import { useEffect, useState } from 'react'

import { Hex } from '@/domain/shared/types/eth'

import { useTokenURI } from '@/lib/blockchain'
import { getImageFromTokenURI } from '@/domain/shared/utils/image'

type NFTAttribute = {
  trait_type: string
  value: string
}

type Props = {
  chainId: number
  address: Hex
  tokenId?: string
}

export function NFTSummary({ chainId, address, tokenId }: Props) {
  // UI elements
  const [previewSrc, setPreviewSrc] = useState<string>('/placeholders/token-waiting.svg')

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
    if (!tokenURI) return

    const preview = async () => {
      const image = getImageFromTokenURI(tokenURI)
      setPreviewSrc(image)
    }

    preview()
  }, [tokenURI])

  return (
    <div className="shrink-0 flex justify-center overflow-hidden">
      <img src={previewSrc} className="w-full object-cover" alt="token preview" />
    </div>
  )
}
