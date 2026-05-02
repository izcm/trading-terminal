import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'

import type { Hex } from '@/domain/shared/eth'

import { toast } from '@/ui/molecules'
import { ArrowList } from '@/ui/molecules'
import { TxRow } from '@/ui/organisms'
import { ArrowRow, Modal } from '@/ui/atoms'

export type TxStatus = 'pending' | 'success' | 'failed'
export type TxLabel = 'order filled' | 'order cancelled' | 'transaction'

export type Tx = {
  hash: Hex
  status: TxStatus
  label: TxLabel
  listingId?: string
  onConfirmed?: () => void
  decodeError?: (error: unknown) => string | undefined
  error?: string
  createdAt: number
}

export type AddTxParams = {
  hash: Hex
  listingId?: string
  label?: TxLabel
  onConfirmed?: () => void
  decodeError?: (error: unknown) => string | undefined
}

type TxContextType = {
  txs: Tx[]
  addTx: (params: AddTxParams) => void
  showTxs: (cb: (tx: Tx) => void) => void
}

const TxContext = createContext<TxContextType | null>(null)

export function TxProvider({ children }: { children: ReactNode }) {
  const [txs, setTxs] = useState<Tx[]>([])
  const [open, setOpen] = useState(false)
  const [selectedHash, setSelectedHash] = useState<string | undefined>()

  const callbackRef = useRef<(tx: Tx) => void>(() => {})

  const addTx: TxContextType['addTx'] = ({
    hash,
    listingId,
    label = 'transaction',
    onConfirmed,
    decodeError,
  }) => {
    setTxs(prev => {
      if (prev.some(tx => tx.hash === hash)) return prev
      return [
        ...prev,
        {
          hash,
          status: 'pending',
          listingId,
          label,
          onConfirmed,
          decodeError,
          createdAt: Date.now(),
        },
      ]
    })
  }

  const updateTx = (hash: Hex, status: TxStatus, error?: string) => {
    setTxs(prev =>
      prev.map(tx => (tx.hash !== hash || tx.status === status ? tx : { ...tx, status, error }))
    )
  }

  const showTxs = (cb: (tx: Tx) => void) => {
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
            // setTimeout is for demo purposes — local fork mines blocks very fast
            setTimeout(() => {
              toast({
                title: 'Transaction confirmed',
                description:
                  'Your tx is confirmed on-chain. The marketplace should update shortly.',
                variant: 'success',
              })
              updateTx(tx.hash, 'success')
              tx.onConfirmed?.()
            }, 1500)
          }}
          onFail={(decoded?: string) => {
            setTimeout(() => {
              toast({
                title: 'Transaction not completed',
                description:
                  decoded ??
                  'It may have been rejected, reverted, or out of gas. Please try again.',
                variant: 'error',
              })
              updateTx(tx.hash, 'failed', decoded)
            }, 1500)
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
                  if (item.status !== 'success') return // tmp: no callback for failed tx

                  callbackRef.current(item)
                  setOpen(false)
                }}
                className="transition rounded-lg"
                dataId={item.hash}
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
  onFail: (decoded?: string) => void
}) {
  const { isError, isSuccess, error } = useWaitForTransactionReceipt({ hash: tx.hash })
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return

    if (isSuccess) {
      handledRef.current = true
      onSuccess()
    }

    if (isError) {
      handledRef.current = true
      onFail(tx.decodeError?.(error) ?? error?.message)
    }
  }, [isSuccess, isError, onSuccess, onFail, error, tx])

  return null
}

export function useTx() {
  const ctx = useContext(TxContext)
  if (!ctx) throw new Error('TxProvider missing')
  return ctx
}
