import { Hex } from 'viem'
import { useEffect, useState } from 'react'
import { TextInput } from '@/components/atoms'
import { useTokenURI } from '@/lib/blockchain'
import { getImageFromTokenURI } from '@/lib/utils/image'
import { NFTSummary } from '../cards/NFtSummary'

type Props = {
  chainId: number
  address: Hex
  onConfirm: (tokenId: bigint) => void
}

export function NFTSelectForm({ chainId, address, onConfirm }: Props) {
  const [tokenIdInput, setTokenIdInput] = useState('')
  const [tokenId, setTokenId] = useState<bigint | null>(null)
  const [preview, setPreview] = useState('/placeholders/token-waiting.svg')

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
        <span className="text-sm mb-2">Token ID</span>
        <TextInput value={tokenIdInput} onChange={e => setTokenIdInput(e)} placeholder="eg. 44" />
      </div>

      <NFTSummary image={preview} />

      <button disabled={!tokenId} onClick={submit} className="btn btn-primary w-full">
        fill order
      </button>
    </div>
  )
}
