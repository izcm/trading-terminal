import { useTx } from '@/app/providers/TxProvider'

export function TxTracker() {
  const { number, setNumber } = useTx()

  return (
    <div>
      <button onClick={() => setNumber(number + 1)} className="btn btn-primary">
        number now: {number}
      </button>
    </div>
  )
}
