import { Hex } from 'viem'
import { useEffect, useState } from 'react'

import { TextInput } from '@/components/atoms'
import { useTokenURI } from '@/lib/blockchain'
import { getImageFromTokenURI } from '@/lib/utils/image'
import { NFTSummary } from '../cards/NFTSummary'
import { shortAddr } from '@/lib/utils/format'

type Props = {
  chainId: number
  collection: {
    address: Hex
    symbol?: string
  }
  validation: {
    canConfirm: boolean
    checking: boolean
    error: string
  }
  onValidate: (tokenId: bigint) => void
  onConfirm: () => void
}

export function NFTSelectForm({ chainId, collection, validation, onValidate, onConfirm }: Props) {
  const [tokenIdInput, setTokenIdInput] = useState('')
  const [tokenId, setTokenId] = useState<bigint | null>(null)

  const { address, symbol } = collection

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

  //   const inputError =
  //   tokenIdInput.length === 0 ? '' : saneInput(tokenIdInput) ? '' : 'digits only'

  // const uiError = inputError || validation.error

  const handleValidate = (tidStr: string) => {
    if (!saneInput(tidStr)) return // sanity check
    const tid = BigInt(tidStr)

    setTokenId(tid)
    onValidate(tid)
  }

  return (
    <div className="flex flex-col gap-4">
      <span>{title}</span>
      <div className="flex gap-2">
        <TextInput value={tokenIdInput} onChange={e => setTokenIdInput(e)} placeholder="eg. 44" />
        <button
          disabled={!tokenIdInput || !saneInput(tokenIdInput)}
          onClick={() => handleValidate(tokenIdInput)}
          className="btn btn-accent"
        >
          check
        </button>
      </div>

      <NFTSummary image={tokenURI && getImageFromTokenURI(tokenURI)} />

      <button disabled={!tokenId} onClick={() => alert('hello')} className="btn btn-primary w-full">
        fill order
      </button>
    </div>
  )
}
