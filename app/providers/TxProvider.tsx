import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'

import type { Hex } from '@/domain/shared/eth'

import { toast } from '@/ui/organisms'
import { ArrowList, TxRow } from '@/ui/molecules'
import { ArrowRow, Modal } from '@/ui/atoms'

export type TxStatus = 'pending' | 'success' | 'failed'
export type TxLabel = 'order filled' | 'order cancelled' | 'transaction'

export type Tx = {
  hash: Hex
  status: TxStatus
  label: TxLabel
  listingId?: string
  onConfirmed?: () => void
  createdAt: number
}

type TxContextType = {
  txs: Tx[]
  addTx: (hash: Hex, listingId?: string, label?: TxLabel, onConfirmed?: () => void) => void
  showTxs: (cb: (tx: Tx) => void) => void
}

export const TxContext = createContext<TxContextType | null>(null)

export function TxProvider({ children }: { children: ReactNode }) {
  const [txs, setTxs] = useState<Tx[]>([])
  const [open, setOpen] = useState(false)
  const [selectedHash, setSelectedHash] = useState<string | undefined>()

  const callbackRef = useRef<(tx: Tx) => void>(() => {})

  function addTx(
    hash: Hex,
    listingId?: string,
    label: TxLabel = 'transaction',
    onConfirmed?: () => void
  ) {
    setTxs(prev => {
      if (prev.some(tx => tx.hash === hash)) return prev
      return [
        ...prev,
        { hash, status: 'pending', listingId, label: label, onConfirmed, createdAt: Date.now() },
      ]
    })
  }

  function updateTx(hash: Hex, status: TxStatus) {
    setTxs(prev =>
      prev.map(tx => (tx.hash !== hash || tx.status === status ? tx : { ...tx, status }))
    )
  }

  function showTxs(cb: (tx: Tx) => void) {
    callbackRef.current = cb ?? (() => {})

    if (txs.length > 0) {
      setSelectedHash(txs[txs.length - 1].hash)
    }

    setOpen(true)
  }

  return (
    <TxContext.Provider value={{ txs, addTx, showTxs }}>
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
      {open && (
        <Modal isOpen onClose={() => setOpen(false)}>
          <ArrowList
            items={[...txs].reverse()}
            getId={tx => tx.hash}
            selectedId={selectedHash}
            onSelect={tx => setSelectedHash(tx.hash)}
            className="rounded-lg p-1 border border-default"
          >
            {({ item, isSelected, onSelect }) => (
              <ArrowRow
                key={item.hash}
                isSelected={isSelected}
                onSelect={() => {
                  onSelect()
                  callbackRef.current(item)
                  setOpen(false)
                }}
                className="transition rounded-lg"
              >
                <div className="cursor-pointer">
                  <TxRow tx={item} />
                </div>
              </ArrowRow>
            )}
          </ArrowList>
        </Modal>
      )}
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
