import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import type { Hex } from '@/domain/shared/eth'
import { useWaitForTransactionReceipt } from 'wagmi'
import { toast } from '@/ui/organisms'

type TxStatus = 'pending' | 'success' | 'failed'

export type Tx = {
  hash: Hex
  status: TxStatus
  listingId?: string
  onConfirmed?: () => void
}

type TxContextType = {
  txs: Tx[]
  addTx: (hash: Hex, listingId?: string, onConfirmed?: () => void) => void
}

export const TxContext = createContext<TxContextType | null>(null)

export function TxProvider({ children }: { children: ReactNode }) {
  const [txs, setTxs] = useState<Tx[]>([])

  const addTx = useCallback<TxContextType['addTx']>(
    (hash, listingId, onConfirmed) => {
      setTxs(prev => {
        if (prev.some(tx => tx.hash === hash)) return prev
        return [...prev, { hash, status: 'pending', listingId, onConfirmed }]
      })
    },
    [setTxs]
  )

  const updateTx = (hash: Hex, status: TxStatus) => {
    setTxs(prev =>
      prev.map(tx => (tx.hash !== hash || tx.status === status ? tx : { ...tx, status }))
    )
  }

  return (
    <TxContext.Provider value={{ txs, addTx }}>
      {txs.map(tx => (
        <TxWatcher
          key={tx.hash}
          tx={tx}
          onSuccess={() => {
            updateTx(tx.hash, 'success')
            tx.onConfirmed?.()
          }}
          onFail={() => {
            updateTx(tx.hash, 'failed')
          }}
        />
      ))}
      {children}
    </TxContext.Provider>
  )
}

function TxWatcher({
  tx,
  onSuccess,
  onFail,
}: {
  tx: Tx
  onSuccess: () => void
  onFail: () => void
}) {
  const { isError, isSuccess } = useWaitForTransactionReceipt({ hash: tx.hash })
  const handledRef = useRef(false)
  useEffect(() => {
    if (handledRef.current) return

    // setTimeout is for demo purposes to make experience more realistic (local fork executes blocks very fast)
    // + could solve it by setting --block-time as param to fork
    // but that made demo pipeline run way too slow

    if (isSuccess) {
      handledRef.current = true
      const timer = setTimeout(() => {
        toast({
          title: 'Transaction confirmed',
          description: 'Your tx is confirmed on-chain. The marketplace should update shortly.',
          variant: 'success',
        })
        onSuccess()
      }, 1500)
      return () => clearTimeout(timer)
    }

    if (isError) {
      handledRef.current = true
      const timer = setTimeout(() => {
        toast({
          title: 'Transaction not completed',
          description: 'It may have been rejected, reverted, or out of gas. Please try again.',
          variant: 'error',
        })
        onFail()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, isError, onSuccess, onFail])

  return null
}

export function useTx() {
  const ctx = useContext(TxContext)
  if (!ctx) throw new Error('TxProvider missing')
  return ctx
}
