'use client'

import { useState } from 'react'

import type { Hex } from '@/domain/shared/types/eth'

import { TextInput } from '@/components/atoms'
import { shortAddr } from '@/domain/shared/types'
import { getImageFromTokenURI } from '@/domain/shared/utils/image'
import { NFTSummary } from '@/components/organisms/NFTSummary'

type Props = {
  chainId: number
  collection: {
    address: Hex
    symbol?: string
  }
  validation: {
    canConfirm: boolean
    checking: boolean
    error: string | undefined
  }
  onValidate: (tokenId: bigint) => void
  onConfirm: () => void
}

export function NFTSelect({ chainId, collection, validation, onValidate, onConfirm }: Props) {
  const [tokenIdInput, setTokenIdInput] = useState('')
  const [tokenId, setTokenId] = useState<bigint | null>(null)

  const { address, symbol } = collection

  const title = 'token id in ' + (symbol !== undefined ? symbol : shortAddr(address))

  const saneInput = (input: string) => /^\d+$/.test(input)

  const inputError = tokenIdInput.length === 0 ? '' : saneInput(tokenIdInput) ? '' : 'digits only'
  const uiError = inputError || validation.error

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
      <span>{uiError}</span>
      <span>{validation.checking}</span>

      <NFTSummary chainId={chainId} address={collection.address} tokenId={tokenId?.toString()} />

      <button disabled={!tokenId} onClick={() => alert('hello')} className="btn btn-primary w-full">
        fill order
      </button>
    </div>
  )
}
