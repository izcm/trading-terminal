import { Hex } from '@/domain/shared/eth'
import { createContext, ReactNode, useContext, useState } from 'react'

type TxStatus = 'pending' | 'success' | 'failed'

type Tx = {
  hash: Hex
  status: TxStatus
}

type TxManager = {
  txs: Tx[]
  addTx: (hash: Hex) => void
}

export type Something = {
  number: number
  setNumber: (i: number) => void
}

export const TxContext = createContext<Something | null>(null)

export function TxProvider({ children }: { children: ReactNode }) {
  const [number, setNumber] = useState<number>(0)

  return <TxContext value={{ number, setNumber }}>{children}</TxContext>
}

export function useTx() {
  const ctx = useContext(TxContext)
  if (!ctx) throw new Error('TxProvider missing')
  return ctx
}
