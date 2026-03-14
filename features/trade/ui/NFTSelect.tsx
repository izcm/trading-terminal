'use client'

import { useState } from 'react'

import type { Hex } from '@/domain/shared/eth'

import { NFTPreview } from '@/features/explore/ui/NFTPreview'
import { TextInput } from '@/ui/atoms'

type Props = {
  chainId: number
  address: Hex
  validation: {
    canConfirm: boolean
    checking: boolean
    error?: string
  }
  onValidate: (tokenId: bigint) => void
  onConfirm: () => void
}

export function NFTSelect({ chainId, address, validation, onValidate, onConfirm }: Props) {
  const [tokenIdInput, setTokenIdInput] = useState('')
  const [tokenId, setTokenId] = useState<bigint | undefined>(undefined)

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
    <div className="flex flex-col gap-4 max-w-[200px]">
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

      <div>
        <div className="pointer-events-none">
          <NFTPreview chainId={chainId} address={address} tokenId={tokenId} />
        </div>
      </div>

      <button disabled={!tokenId} onClick={() => alert('hello')} className="btn btn-primary w-full">
        fill order
      </button>
    </div>
  )
}
