import { useEffect, useRef, useState } from 'react'

import { Spinner, TextInput } from '@/ui/atoms'

export type FormInput = {
  price: string
  end: number
  start: number
}

type Props = {
  tokenId: bigint
  onSubmit: (formInput: FormInput) => Promise<void>
  back?: () => void
}

const durations = [
  { label: '7d', seconds: 86400 * 7 },
  { label: '30d', seconds: 86400 * 30 },
  { label: '90d', seconds: 86400 * 90 },
]

export function OrderForm({ tokenId, onSubmit, back }: Props) {
  const [price, setPrice] = useState('')
  const [pending, setPending] = useState(false)

  const [selectedDuration, setSelectedDuration] = useState<number>(durations[0].seconds)

  const [start, setStart] = useState(() => {
    const now = Math.floor(Date.now() / 1000)
    return String(now)
  })

  const [end, setEnd] = useState(() => {
    const now = Math.floor(Date.now() / 1000)
    return String(now + durations[0].seconds)
  })

  const formRef = useRef<HTMLFormElement>(null)

  // autofocus first element of form
  useEffect(() => {
    const form = formRef.current
    if (!form) return

    const first = form.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    first?.focus()
  }, [])

  const valid = tokenId !== undefined && price && Number(price) > 0

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!valid || pending) return

    setPending(true)
    try {
      await onSubmit({ price, start: Number(start), end: Number(end) })
    } finally {
      setPending(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={submit} className="flex flex-col w-[400px] gap-4">
      <div className="text-subtle">nft #{tokenId}</div>

      <div>
        <div className="text-subtle mb-2">Price (WETH)</div>
        <TextInput placeholder="0.15" value={price} onChange={setPrice} numeric />
      </div>

      <div>
        <div className="text-subtle mb-2">Durations (days)</div>

        <div className="flex justify-center gap-4">
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
              className="btn btn-rounded w-full h-12 h-12 text-muted"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {back && (
          <button type="button" onClick={back} className="flex-1 btn btn-ghost">
            back
          </button>
        )}

        <button
          type="submit"
          disabled={!valid || pending}
          className={`flex-1 btn ${pending ? 'btn-ghost' : 'btn-primary'}`}
        >
          {pending ? (
            <>
              <Spinner size={14} /> Pending...
            </>
          ) : (
            'Create order'
          )}
        </button>
      </div>
    </form>
  )
}
