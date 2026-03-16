import { DURATIONS } from '@/domain/constants/durations'
import { Hex } from '@/domain/shared/eth'
import { OwnedNFTPicker } from '@/features/OwnedNFTPicker'
import { TextInput } from '@/ui/atoms'
import { useState } from 'react'

type Props = {
  chainId: number
  collection: Hex
  user: Hex
  onConfirm: () => void
}

export function CreateOrderMenu({ chainId, collection, user, onConfirm }: Props) {
  const [stage, setStage] = useState<'pick' | 'terms'>('pick')

  const [tokenId, setTokenId] = useState<bigint>()
  const [price, setPrice] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const valid = tokenId !== undefined && Number(price) > 0 && Number(end) > Number(start)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (valid) onConfirm()
  }

  if (stage === 'pick')
    return (
      <div className="flex flex-col gap-2">
        <div className="h-[320px] min-h-0">
          <OwnedNFTPicker
            chainId={chainId}
            collection={collection}
            user={user}
            selectedTokenId={tokenId}
            onSelect={nft => setTokenId(nft.tokenId)}
          />
        </div>

        <button disabled={!tokenId} onClick={() => setStage('terms')} className="btn btn-accent">
          next
        </button>
      </div>
    )

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="text-text-muted">nft #{tokenId}</div>

      <div>
        <div className="text-text-muted">Price (ETH)</div>
        <TextInput placeholder="0.15" value={price} onChange={setPrice} />
      </div>

      <div className="flex gap-2 flex-col sm:flex-row">
        <TextInput placeholder="start timestamp" value={start} onChange={setStart} />

        <TextInput placeholder="end timestamp" value={end} onChange={setEnd} />
      </div>

      {!valid && <div className="text-red-400">invalid order</div>}

      <div className="flex gap-2">
        <button type="button" onClick={() => setStage('pick')} className="flex-1 btn btn-ghost">
          back
        </button>

        <button type="submit" disabled={!valid} className="flex-1 btn btn-accent">
          create order
        </button>
      </div>
    </form>
  )
}
