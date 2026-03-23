import { useEffect, useRef, useState } from 'react'

import { OrderCore } from '@/protocol/eip712'
import { Hex } from '@/domain/shared/eth'

import { OwnedNFTPicker } from '@/features/inventory/ui/OwnedNFTPicker'
import { TextInput } from '@/ui/atoms'

type Props = {
  chainId: number
  collection: Hex
  user: Hex
  onConfirm: (order: OrderCore) => Promise<void>
}

export function CreateOrderMenu({ chainId, collection, user, onConfirm }: Props) {
  const [stage, setStage] = useState<'pick' | 'terms'>('pick')

  const [tokenId, setTokenId] = useState<string>()
  const [price, setPrice] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const formRef = useRef<HTMLFormElement>(null)

  // autofocus first element on stage change
  useEffect(() => {
    if (stage === 'pick') return
    const form = formRef.current
    if (!form) return

    const first = form.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    first?.focus()
  }, [stage])

  const valid = tokenId !== undefined

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return

    const order: OrderCore = {
      side: 0,
      isCollectionBid: false,
      actor: user,
      collection,
      tokenId,
      price: '1',
      currency: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      start: 0,
      end: 1776371736,
      nonce: Date.now().toString(),
    }
  }

  if (stage === 'pick')
    return (
      <div className="flex flex-col gap-2">
        <div className="h-[320px] min-h-0">
          <OwnedNFTPicker
            chainId={chainId}
            collection={collection}
            user={user}
            selectedId={tokenId}
            onSelect={nft => setTokenId(nft.tokenId.toString())}
          />
        </div>

        <button disabled={!tokenId} onClick={() => setStage('terms')} className="btn btn-primary">
          next
        </button>
      </div>
    )

  return (
    <form ref={formRef} onSubmit={submit} className="flex flex-col gap-3">
      <div className="text-text-muted">nft #{tokenId}</div>

      <div>
        <div className="text-text-muted">Price (ETH)</div>
        <TextInput placeholder="0.15" defaultValue={price} onSubmit={setPrice} />
      </div>

      <div className="flex gap-2 flex-col sm:flex-row">
        <TextInput placeholder="start timestamp" defaultValue={start} onSubmit={setStart} />
        <TextInput placeholder="end timestamp" defaultValue={end} onSubmit={setEnd} />
      </div>

      {!valid && <div className="text-red-400">invalid order</div>}
      {state?.error && <div className="text-red-400">{state.error}</div>}

      <div className="flex gap-2">
        <button type="button" onClick={() => setStage('pick')} className="flex-1 btn btn-ghost">
          back
        </button>

        <button type="submit" disabled={pending || !valid} className="flex-1 btn btn-primary">
          {pending ? 'creating...' : 'create order'}
        </button>
      </div>
    </form>
  )
}
