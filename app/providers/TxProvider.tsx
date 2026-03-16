import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react'

import { Hex } from '@/domain/shared/eth'
import { useWaitForTransactionReceipt } from 'wagmi'

type TxStatus = 'pending' | 'success' | 'failed'

type Tx = {
  hash: Hex
  status: TxStatus
}

type TxContextType = {
  txs: Tx[]
  addTx: (hash: Hex) => void
}

export const TxContext = createContext<TxContextType | null>(null)

export function TxProvider({ children }: { children: ReactNode }) {
  const [txs, setTxs] = useState<Tx[]>([])

  const addTx = (hash: Hex) => {
    setTxs(prev => [...prev, { hash, status: 'pending' }])
  }

  const updateTx = (hash: Hex, status: TxStatus) => {
    setTxs(prev => prev.map(tx => (tx.hash === hash ? { ...tx, status } : tx)))
  }

  return (
    <TxContext value={{ txs, addTx }}>
      {txs.map(tx => (
        <TxWatcher
          key={tx.hash}
          hash={tx.hash}
          onSuccess={() => updateTx(tx.hash, 'success')}
          onFail={() => updateTx(tx.hash, 'failed')}
        />
      ))}
      {children}
    </TxContext>
  )
}

export function TxWatcher({
  hash,
  onSuccess,
  onFail,
}: {
  hash: Hex
  onSuccess: () => void
  onFail: () => void
}) {
  const { isError, isSuccess } = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    if (isSuccess) onSuccess()
    if (isError) onFail()
  }, [isSuccess, isError])

  return null
}

export function useTx() {
  const ctx = useContext(TxContext)
  if (!ctx) throw new Error('TxProvider missing')
  return ctx
}
