import { useEffect, useRef } from 'react'
import { toast } from '@/ui/organisms/core/Toast'
import { useTx } from '@/app/providers/TxProvider'

export function TxTracker() {
  const { txs } = useTx()

  // tracks toasts by tx hash
  // const [txs, setTxs] = useState([{ hash: '0abc', status: 'pending' }])

  const seen = useRef(new Set<string>())

  const pending = txs.filter(tx => tx.status === 'pending')

  useEffect(() => {
    txs.forEach(tx => {
      if (seen.current.has(tx.hash)) return

      if (tx.status === 'success') {
        toast({
          title: 'Transaction confirmed',
          description: 'Your tx is confirmed on-chain. The marketplace should update shortly.',
        })
        seen.current.add(tx.hash)
      }

      // todo: failed toast need some failure indicator eg. red title etc.
      if (tx.status === 'failed') {
        toast({
          title: 'Transaction not completed',
          description: 'It may have been rejected, reverted, or out of gas. Please try again.',
        })
        seen.current.add(tx.hash)
      }
    })
  }, [txs])

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
