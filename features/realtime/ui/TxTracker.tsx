import type { Tx } from '@/app/providers/TxProvider'
import { useTx } from '@/app/providers/TxProvider'
import { cn } from '@/lib/utils/cn'

type Props = {
  onNavigateToTx: (tx: Tx) => void
  className?: string
  highlightOnFirstTx?: boolean
  label?: string
}

export function TxTracker({
  onNavigateToTx,
  className,
  highlightOnFirstTx = true,
  label = 'txs',
}: Props) {
  const { txs, showTxs } = useTx()

  const pending = txs.filter(tx => tx.status === 'pending')
  const executed = txs.filter(tx => tx.status !== 'pending')

  const disabled = txs.length === 0

  const stateClass = disabled
    ? 'pointer-events-none border-white/8 text-muted bg-transparent'
    : executed.length === 1
      ? cn(
          'border-accent/40 text-subtle bg-accent/10 hover:bg-accent/20 hover:border-accent/60 hover:text-fg',
          highlightOnFirstTx && 'highlight-pulse'
        )
      : 'border-white/15 text-subtle bg-white/5 hover:bg-white/10 hover:border-white/30 hover:text-fg'

  return (
    <button
      key={executed.length}
      disabled={disabled}
      className={cn(
        'flex items-center gap-2 rounded-full border border-black px-3 py-1 text-xs cursor-pointer transition-all duration-150 active:scale-[0.97]',
        stateClass,
        className
      )}
      onClick={() => showTxs(onNavigateToTx)}
    >
      <PulseDot active={pending.length > 0} />
      <span>
        view {label} ({executed.length})
      </span>
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
