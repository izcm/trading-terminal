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

  const { data: tokenURI } = useTokenURI(
    tokenId
      ? {
          chainId,
          address,
          tokenId,
        }
      : undefined
  )

  const saneInput = (input: string) => /^\d+$/.test(input)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="text-sm mb-2">{title}</span>
        <TextInput value={tokenIdInput} onChange={e => setTokenIdInput(e)} placeholder="eg. 44" />
      </div>

      <NFTSummary image={preview} />

      <button
        disabled={!tokenIdInput || !saneInput(tokenIdInput)}
        onClick={() => setTokenId(BigInt(tokenIdInput))}
        className="btn btn-primary w-full"
      >
        preview + validate
      </button>
      {/* <button disabled={!tokenId} onClick={() => alert('hello')} className="btn btn-primary w-full">
        fill order
      </button> */}
    </div>
  )
}
