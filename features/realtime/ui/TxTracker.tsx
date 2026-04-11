import type { Tx } from '@/app/providers/TxProvider'
import { useTx } from '@/app/providers/TxProvider'

export function TxTracker({ onNavigateToTx }: { onNavigateToTx: (tx: Tx) => void }) {
  const { txs, showTxs } = useTx()

  const pending = txs.filter(tx => tx.status === 'pending')
  const executed = txs.filter(tx => tx.status !== 'pending')

  const disabled = txs.length === 0

  return (
    <button
      key={executed.length}
      disabled={disabled}
      className={`
        flex items-center gap-2
        rounded-full border border-default
        bg-surface/90 backdrop-blur
        px-3 py-1 text-xs text-muted

        cursor-pointer
        transition-all duration-150

          hover:border-accent/40
        hover:text-primary
        hover:bg-accent/25

        active:scale-[0.97]
        ${executed.length === 1 ? 'border-highlight' : ''}

        ${disabled ? 'pointer-events-none' : ''}
        `}
      onClick={() => showTxs(onNavigateToTx)}
    >
      <PulseDot active={pending.length > 0} />
      <span>{executed.length} txs</span>
    </button>
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
