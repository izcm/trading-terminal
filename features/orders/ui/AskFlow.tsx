import { useState } from 'react'

import type { NFT } from '@/domain/nft'

import { NFTPicker } from '@/ui/organisms/NFTPicker'
import { FormInput, OrderForm } from './OrderForm'

type Props = {
  nftSelection: NFT[]
  onConfirm: (orderInput: OrderInput) => void
}

export type OrderInput = FormInput & {
  tokenId: string
}

export function AskFlow({ nftSelection, onConfirm }: Props) {
  const [stage, setStage] = useState<'pick' | 'terms'>('pick')

  const [tokenId, setTokenId] = useState<string>(nftSelection[0]?.tokenId.toString())

  function wrapAsk(input: FormInput) {
    onConfirm({
      tokenId,
      ...input,
    })
  }

  if (stage === 'pick')
    return (
      <div className="flex flex-col gap-2">
        <div className="w-[400px] h-[380px] min-h-0">
          <NFTPicker
            nfts={nftSelection}
            selectedId={tokenId}
            onSelect={nft => setTokenId(nft.tokenId.toString())}
          />
        </div>

        <button disabled={!tokenId} onClick={() => setStage('terms')} className="btn btn-primary">
          next
        </button>
      </div>
    )

  return <OrderForm tokenId={tokenId} onSubmit={wrapAsk} back={() => setStage('pick')} />
}
