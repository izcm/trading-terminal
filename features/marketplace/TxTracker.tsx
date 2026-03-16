import { useTx } from '@/app/providers/TxProvider'

export function TxTracker() {
  const { txs } = useTx()

  return (
    <div className="card">
      {txs.map(tx => (
        <div>tx !</div>
      ))}
    </div>
  )
}
