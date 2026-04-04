import { useTx } from '@/app/providers/TxProvider'

export function TxTracker() {
  const { txs } = useTx()

  const pending = txs.filter(tx => tx.status === 'pending')

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-default bg-surface px-3 py-1">
      <PulseDot active={pending.length > 0} />
      <span
        className={`text-xs ${pending.length > 0 ? 'text-muted animate-pulse' : 'text-muted/60'}`}
      >
        {pending.length > 0 ? `${pending.length} pending` : '0 pending'}
      </span>
    </div>
  )
}

const PulseDot = ({ active }: { active: boolean }) => (
  <span className="relative inline-flex h-2.5 w-2.5">
    {active && (
      <span className="absolute inline-flex h-full w-full rounded-full bg-accent/40 animate-ping" />
    )}
    <span
      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
        active ? 'bg-accent' : 'bg-soft'
      }`}
    />
  </span>
)
