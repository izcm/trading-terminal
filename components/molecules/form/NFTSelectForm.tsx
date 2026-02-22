import { Hex } from 'viem'
import { useEffect, useState } from 'react'

import { TextInput } from '@/components/atoms'
import { useTokenURI } from '@/lib/blockchain'
import { getImageFromTokenURI } from '@/lib/utils/image'
import { NFTSummary } from '../cards/NFTSummary'
import { shortAddr } from '@/lib/utils/format'

type Props = {
  chainId: number
  address: Hex
  symbol?: string
  onConfirm: (tokenId: bigint) => void
}

export function NFTSelectForm({ chainId, address, symbol, onConfirm }: Props) {
  const [tokenIdInput, setTokenIdInput] = useState('')
  const [tokenId, setTokenId] = useState<bigint | null>(null)
  const [preview, setPreview] = useState<string>('/placeholders/token-waiting.svg')

  const title = 'token id in ' + (symbol !== undefined ? symbol : shortAddr(address))

  // string -> bigint
  useEffect(() => {
    if (!tokenIdInput) return setTokenId(null)
    try {
      setTokenId(BigInt(tokenIdInput))
    } catch {
      setTokenId(null)
    }
  }, [tokenIdInput])

  const { data: tokenURI } = useTokenURI(
    tokenId
      ? {
          chainId,
          address,
          tokenId,
        }
      : undefined
  )

  useEffect(() => {
    if (!tokenURI) return
    setPreview(getImageFromTokenURI(tokenURI))
  }, [tokenURI])

  const submit = () => {
    if (!tokenId) return
    onConfirm(tokenId)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="text-sm mb-2">{title}</span>
        <TextInput value={tokenIdInput} onChange={e => setTokenIdInput(e)} placeholder="eg. 44" />
      </div>

      <NFTSummary image={preview} />

      <button disabled={!tokenId} onClick={submit} className="btn btn-primary w-full">
        fill order
      </button>
    </div>
  )
}
