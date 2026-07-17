import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'

import type { Hex } from 'viem'
import { useChainId, useConfig, useWaitForTransactionReceipt } from 'wagmi'

import { TxRow } from '@/ui/organisms'

import { toast } from '@/ui/molecules'
import { ArrowList } from '@/ui/molecules'

import { ArrowRow, Modal } from '@/ui/atoms'

export type TxStatus = 'pending' | 'success' | 'failed'

export type TxProvider = {
  // set a condition for which types of txs have custom navigation
  // if not set / for thos txs who does not pass condition
  // -> redirect to <blockexplorer>/<txh_hash>
  isNavigable?: (tx: Tx) => boolean
  children: ReactNode
}

export type Tx = {
  hash: Hex
  status: TxStatus
  label: string
  listingId?: string
  onConfirmed?: () => void
  decodeError?: (error: unknown) => string | undefined
  error?: string
  createdAt: number
}

export type AddTxParams = {
  hash: Hex
  listingId?: string
  label?: string
  onConfirmed?: () => void
  decodeError?: (error: unknown) => string | undefined
}

type TxContextType = {
  txs: Tx[]
  addTx: (params: AddTxParams) => void
  showTxs: (cb: (tx: Tx) => void) => void
}

const TxContext = createContext<TxContextType | null>(null)

export function TxProvider({ children, isNavigable }: TxProvider) {
  const [txs, setTxs] = useState<Tx[]>([])
  const [open, setOpen] = useState(false)
  const [selectedHash, setSelectedHash] = useState<string | undefined>()

  const config = useConfig()
  const chainId = useChainId()

  const blockExplorer = config.chains.find(chain => chain.id === chainId)?.blockExplorers

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
            toast({
              title: 'Transaction confirmed',
              description: 'Your tx is confirmed on-chain. The marketplace should update shortly.',
              variant: 'success',
              ...(blockExplorer && {
                toastAction: {
                  text: 'See transaction',
                  fn: () => window.open(`${blockExplorer.default.url}/tx/${tx.hash}`, '_blank'),
                },
              }),
            })
            updateTx(tx.hash, 'success')
            tx.onConfirmed?.()
          }}
          onFail={(decoded?: string) => {
            toast({
              title: 'Transaction not completed',
              description:
                decoded ?? 'It may have been rejected, reverted, or out of gas. Please try again.',
              variant: 'error',
            })
            updateTx(tx.hash, 'failed', decoded)
          }}
        />
      ))}
      {open && (
        <Modal
          isOpen
          onClose={() => setOpen(false)}
          selfManagesFocus={txs.length === 0 ? false : true}
        >
          {txs.length === 0 ? (
            <p className="text-sm text-muted px-4 py-6">Session has no transactions yet.</p>
          ) : (
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
                    if (item.status === 'success' && isNavigable?.(item)) {
                      callbackRef.current(item)
                      setOpen(false)
                    } else if (blockExplorer) {
                      window.open(`${blockExplorer.default.url}/tx/${item.hash}`, '_blank')
                    }
                  }}
                  className="transition rounded-lg"
                  dataId={item.hash}
                >
                  <div className="cursor-pointer">
                    <TxRow tx={item} disabled={!isNavigable?.(item) && !blockExplorer} />
                  </div>
                </ArrowRow>
              )}
            </ArrowList>
          )}
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
