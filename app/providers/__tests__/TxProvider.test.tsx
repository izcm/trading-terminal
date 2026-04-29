import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, renderHook, screen } from '@testing-library/react'

import { useWaitForTransactionReceipt } from 'wagmi'

import { useTx, TxProvider, Tx, AddTxParams } from '../TxProvider'

vi.mock('wagmi', () => ({
  useWaitForTransactionReceipt: vi.fn(() => ({ isError: false, isSuccess: false })),
}))

type MockReceipt =
  | { isError: false; isSuccess: false }
  | { isError: false; isSuccess: true }
  | { isError: true; isSuccess: false }

function mockTxReceipt(val: MockReceipt) {
  vi.mocked(useWaitForTransactionReceipt, { partial: true }).mockReturnValue(val)
}

vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => children,
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <TxProvider>{children}</TxProvider>
}

function setup() {
  const hook = renderHook(() => useTx(), { wrapper })

  return {
    hook,
    addTx: hook.result.current.addTx,
    showTxs: hook.result.current.showTxs,
    getTxs: () => hook.result.current.txs,
  }
}

const hash = '0xabc'

const fakeTx = (overrides: Partial<Tx> = {}): Tx => ({
  hash: hash,
  status: 'pending',
  label: 'transaction',
  createdAt: Date.now(),
  ...overrides,
})

describe('state', () => {
  it('returns empty txs list', () => {
    const { getTxs } = setup()
    expect(getTxs()).toHaveLength(0)
  })

  // -----------------------
  // ADD TX
  // -----------------------

  describe('addTx', () => {
    it('adds tx', () => {
      const { addTx, getTxs } = setup()

      act(() => addTx({ hash }))

      expect(getTxs()).toHaveLength(1)
    })

    it('does not add duplicate tx', () => {
      const { addTx, getTxs } = setup()

      act(() => addTx({ hash }))
      act(() => addTx({ hash }))

      expect(getTxs()).toHaveLength(1)
    })

    describe('field values', () => {
      function callAddTx(params: AddTxParams = { hash }) {
        const { addTx, getTxs } = setup()
        act(() => addTx(params))
        return getTxs
      }

      it('sets status to pending', () => {
        const getTxs = callAddTx()
        expect(getTxs()[0]).toMatchObject({ status: 'pending' })
      })

      it('sets createdAt', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2024-01-01'))

        const { getTxs, addTx } = setup()

        act(() => {
          addTx({ hash })
        })

        expect(getTxs()[0].createdAt).toBe(new Date('2024-01-01').getTime())
      })

      it('sets provided fields', () => {
        const onConfirmed = () => {}
        const decodeError = () => 'not owner'

        const getTxs = callAddTx({
          hash,
          listingId: 'id_123',
          label: 'order filled',
          onConfirmed,
          decodeError,
        })

        expect(getTxs()[0]).toMatchObject({
          hash,
          listingId: 'id_123',
          label: 'order filled',
          onConfirmed,
          decodeError,
        })
      })

      it('uses defaults for missing fields', () => {
        const getTxs = callAddTx()
        expect(getTxs()[0]).toMatchObject({ label: 'transaction' })
      })
    })

    it('does not affect existing txs', () => {
      const { addTx, getTxs } = setup()

      act(() => addTx({ hash: '0x1' }))
      act(() => addTx({ hash: '0x2' }))

      expect(getTxs()).toHaveLength(2)
      expect(getTxs()[0]).toMatchObject({ hash: '0x1' })
      expect(getTxs()[1]).toMatchObject({ hash: '0x2' })
    })
  })

  // -----------------------
  // SHOW TXS MODAL
  // -----------------------

  describe('showTxs', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(0)
    })

    afterEach(() => {
      cleanup()
      vi.useRealTimers()
    })

    it('opens the modal', () => {
      const { showTxs } = setup()

      act(() => {
        showTxs(() => {})
      })

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('sets row dataId to tx hash', () => {
      const { addTx, showTxs } = setup()

      act(() => {
        addTx({ hash })
        showTxs(() => {})
      })

      const row = screen.getByRole('listitem')

      expect(row.dataset.id).toBe(hash)
    })

    it('orders row date desc', () => {
      const { addTx, showTxs } = setup()

      // later loop => newer item
      for (let i = 0; i < 5; i++) {
        act(() => addTx({ hash: `0x${i}` }))
        vi.advanceTimersByTime(1000)
      }

      act(() => showTxs(() => {}))

      const rows = screen.getAllByRole('listitem')

      // getAllByRole guarantees elements in DOM order (top → bottom)
      expect(rows).toHaveLength(5)
      expect(rows.map(r => r.dataset.id)).toEqual(['0x4', '0x3', '0x2', '0x1', '0x0'])
    })

    it('selects latest tx on open', () => {
      // assert selectedId logic via UI state if possible
    })

    describe('row onClick', () => {
      function setupForStatus(mockResult: MockReceipt, advanceMs: number) {
        mockTxReceipt(mockResult)

        const { addTx, showTxs, getTxs } = setup()
        const cb = vi.fn()

        act(() => {
          addTx({ hash })
        })
        if (advanceMs)
          act(() => {
            vi.advanceTimersByTime(advanceMs)
          })
        act(() => {
          showTxs(cb)
        })

        return { cb, getTxs }
      }

      describe('successfull tx', () => {
        it('triggers callback', () => {
          const { cb } = setupForStatus({ isError: false, isSuccess: true }, 1500)
          fireEvent.click(screen.getByRole('listitem'))

          expect(cb).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ hash }))
        })

        it('closes modal', () => {
          setupForStatus({ isError: false, isSuccess: true }, 1500)
          fireEvent.click(screen.getByRole('listitem'))

          expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })
      })

      describe('non-successfull txs', () => {
        const cases = [
          ['pending', { isError: false, isSuccess: false }, 0],
          ['failed', { isError: true, isSuccess: false }, 1500],
        ] as const

        it.each(cases)('does not call callback for %s tx', (status, mockResult, advanceMs) => {
          const { cb, getTxs } = setupForStatus(mockResult, advanceMs)

          expect(getTxs()[0]).toMatchObject({ hash, status })
          fireEvent.click(screen.getByRole('listitem'))

          expect(cb).not.toHaveBeenCalled()
        })

        it.each(cases)('does not close modal for %s tx', (_status, mockResult, advanceMs) => {
          setupForStatus(mockResult, advanceMs)
          fireEvent.click(screen.getByRole('listitem'))

          expect(screen.queryByRole('dialog')).toBeInTheDocument()
        })
      })
    })
  })
})

// -----------------------
// TX WATCHER
// -----------------------

describe('TxWatcher', () => {
  describe('on transaction success', () => {
    it('sets tx status to success')
    it('calls onConfirmed')
  })

  describe('on transaction failure', () => {
    it('sets tx status to failed')
    it('sets error from decodeError if provided')
    it('sets raw error if no decodeError')
  })

  it('only handles the event once even if effect re-runs')
})
