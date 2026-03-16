import { useEffect, useRef, useState } from 'react'
import { toast } from '@/ui/organisms/core/Toast'
import { useTx } from '@/app/providers/TxProvider'

export function TxTracker() {
  const { txs } = useTx()

  // tracks toasts by tx hash
  // const [txs, setTxs] = useState([{ hash: '0abc', status: 'pending' }])

  const seen = useRef(new Set<string>())

  const pending = txs.filter(tx => tx.status === 'pending')

  useEffect(() => {
    txs.map(tx => {
      if (seen.current.has(tx.hash)) return

      if (tx.status === 'success') {
        toast({
          title: 'Transaction confirmed',
          description: 'Your tx is confirmed on-chain. The marketplace should update shortly.',
        })
        seen.current.add(tx.hash)
      }

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
    <div>
      {pending.length > 0 && (
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1">
          <PulseDot />
          <span className="text-xs text-text-muted animate-pulse">{pending.length} pending</span>
        </div>
      )}
    </div>
  )
}

const PulseDot = () => (
  <span className="relative inline-flex h-2.5 w-2.5">
    <span className="absolute inline-flex h-full w-full rounded-full bg-accent/40 animate-ping" />
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
  </span>
)
