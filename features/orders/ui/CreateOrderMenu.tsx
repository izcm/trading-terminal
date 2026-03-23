import { useEffect, useRef, useState } from 'react'

import { Hex } from '@/domain/shared/eth'

import { NFTPicker } from '@/ui/organisms/NFTPicker'
import { TextInput } from '@/ui/atoms'
import { NFT } from '@/domain/nft'

export type OrderInput = {
  tokenId: string
  price: string
  start: number
  end: number
}

type Props = {
  nftSelection: NFT[] // if ask => ownedNFTs : (if isBid) => nfts per X (eg. collection)
  user: Hex
  onConfirm: (orderInput: OrderInput) => Promise<void>
}

export function CreateOrderMenu({ nftSelection, onConfirm }: Props) {
  const [stage, setStage] = useState<'pick' | 'terms'>('pick')

  const [tokenId, setTokenId] = useState<string>()
  const [price, setPrice] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const durations = [
    { label: '1d', seconds: 86400 },
    { label: '30d', seconds: 86400 * 30 },
    { label: '3m', seconds: 86400 * 90 },
  ]

  const [selectedDuration, setSelectedDuration] = useState<number>()

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

  const valid = tokenId !== undefined && price && Number(price) > 0

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!valid) return

    onConfirm({
      tokenId,
      price,
      start: Number(start),
      end: Number(end),
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

  return (
    <form ref={formRef} onSubmit={submit} className="flex flex-col w-[400px] gap-4">
      <div className="text-muted">nft #{tokenId}</div>

      <div>
        <div className="text-muted">Price (ETH)</div>
        <TextInput placeholder="0.15" value={price} onChange={setPrice} />
      </div>

      <div className="flex justify-center gap-4 px-2">
        {durations.map(d => (
          <button
            key={d.label}
            type="button"
            data-active={selectedDuration === d.seconds}
            onClick={() => {
              setSelectedDuration(d.seconds)

              const now = Math.floor(Date.now() / 1000)
              setStart(String(now))
              setEnd(String(now + d.seconds))
            }}
            className="
              btn btn-rounded w-full h-12 h-12
            "
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* <div className="flex gap-2 flex-col sm:flex-row">
        <TextInput placeholder="start timestamp" value={start} onChange={setStart} />
        <TextInput placeholder="end timestamp" value={end} onChange={setEnd} />
      </div> */}

      {!valid && <div className="text-red-400">invalid order</div>}

      <div className="flex gap-2">
        <button type="button" onClick={() => setStage('pick')} className="flex-1 btn btn-ghost">
          back
        </button>

        <button type="submit" disabled={!valid} className="flex-1 btn btn-primary">
          create order
        </button>
      </div>
    </form>
  )
}
