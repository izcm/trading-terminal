import type { Tx } from '@/app/providers/TxProvider'
import { useTx } from '@/app/providers/TxProvider'

export function TxTracker({ onNavigateToTx }: { onNavigateToTx: (tx: Tx) => void }) {
  const { txs, showTxs } = useTx()

  const pending = txs.filter(tx => tx.status === 'pending')
  const executed = txs.filter(tx => tx.status !== 'pending')

  const disabled = txs.length === 0

  const stateClass = disabled
    ? 'pointer-events-none border-white/8 text-muted bg-transparent'
    : executed.length === 1
      ? 'border-accent/40 text-subtle bg-accent/10 hover:bg-accent/20 hover:border-accent/60 hover:text-fg border-highlight'
      : 'border-white/15 text-subtle bg-white/5 hover:bg-white/10 hover:border-white/30 hover:text-fg'

  return (
    <button
      key={executed.length}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs cursor-pointer transition-all duration-150 active:scale-[0.97] ${stateClass}`}
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
      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${active ? 'bg-accent' : 'bg-soft'}`}
    />
  </span>
)
