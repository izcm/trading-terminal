import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, renderHook, screen } from '@testing-library/react'

import { useWaitForTransactionReceipt } from 'wagmi'

import { useTx, TxProvider, AddTxParams, Tx } from '../TxProvider'

vi.mock('wagmi', () => ({
  useWaitForTransactionReceipt: vi.fn(() => ({ isError: false, isSuccess: false, error: null })),
}))

vi.mock('@/lib/blockchain/wagmi', () => ({ wagmiConfig: {} }))

type MockReceipt =
  | { isError: false; isSuccess: false }
  | { isError: false; isSuccess: true }
  | { isError: true; isSuccess: false }

function mockTxReceipt(val: MockReceipt, error?: unknown) {
  // @ts-expect-error don't enforce useWait error type
  vi.mocked(useWaitForTransactionReceipt, { partial: true }).mockReturnValueOnce({ ...val, error })
}

vi.mock('focus-trap-react', () => ({
  FocusTrap: ({ children }: { children: React.ReactNode }) => children,
}))

const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <TxProvider>{children}</TxProvider>
}

function setup() {
  const hook = renderHook(() => useTx(), { wrapper })

  const getTxs = () => hook.result.current.txs
  const getOnlyTx = () => {
    expect(getTxs()).toHaveLength(1)
    return getTxs()[0]
  }

  return {
    hook,
    addTx: (params: AddTxParams) => hook.result.current.addTx(params),
    showTxs: (cb: (tx: Tx) => void) => hook.result.current.showTxs(cb),
    getTxs,
    getOnlyTx,
  }
}

const hash = '0xabc'

type SetupOpts = {
  advanceTime?: boolean
  showModal?: boolean
  tx?: Partial<AddTxParams>
  error?: unknown
}

function setupForSuccess(opts?: SetupOpts) {
  return setupForStatus({ isError: false, isSuccess: true }, { advanceTime: true, ...opts })
}

function setupForFailure(opts?: SetupOpts) {
  return setupForStatus({ isError: true, isSuccess: false }, { advanceTime: true, ...opts })
}

function setupForPending(opts?: SetupOpts) {
  return setupForStatus({ isError: false, isSuccess: false }, opts)
}

function setupForStatus(
  mockResult: MockReceipt,
  { advanceTime = false, showModal = false, tx, error }: SetupOpts = {}
) {
  mockTxReceipt(mockResult, error)

  const { hook, addTx, showTxs, getTxs, getOnlyTx } = setup()
  const cb = vi.fn()

  act(() => {
    addTx({ hash, ...tx })
  })
  if (advanceTime)
    act(() => {
      vi.advanceTimersByTime(1500)
    })
  if (showModal)
    act(() => {
      showTxs(cb)
    })

  return { hook, cb, getTxs, getOnlyTx }
}

describe('state', () => {
  describe('getTxs', () => {
    it('returns empty txs list', () => {
      const { getTxs } = setup()
      expect(getTxs()).toHaveLength(0)
    })
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
})

// -----------------------
// TXS MODAL
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
    act(() => showTxs(() => {}))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shows empty state message when there are no txs', () => {
    const { showTxs } = setup()
    act(() => showTxs(() => {}))
    expect(screen.getByText('Session has no transactions yet.')).toBeInTheDocument()
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

  function addNTxsAndShow(n: number) {
    const { addTx, showTxs } = setup()
    for (let i = 0; i < n; i++) {
      act(() => addTx({ hash: `0x${i}` }))
      vi.advanceTimersByTime(1000)
    }
    act(() => showTxs(() => {}))
    return screen.getAllByRole('listitem')
  }

  it('orders row date desc', () => {
    const rows = addNTxsAndShow(5)
    expect(rows.map(r => r.dataset.id)).toEqual(['0x4', '0x3', '0x2', '0x1', '0x0'])
  })

  it('selects latest tx on open', () => {
    const rows = addNTxsAndShow(5)
    const latest = rows.find(r => r.dataset.id === '0x4')
    expect(latest).toHaveAttribute('tabindex', '0') // arrowRow selected is only row with tabIndex 0
  })

  describe('row onClick', () => {
    describe('successfull tx', () => {
      it('triggers callback', () => {
        const { cb } = setupForSuccess({ showModal: true })
        fireEvent.click(screen.getByRole('listitem'))
        expect(cb).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ hash }))
      })

      it('closes modal', () => {
        setupForSuccess({ showModal: true })
        fireEvent.click(screen.getByRole('listitem'))
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    describe('non-successfull txs', () => {
      const cases = [
        ['pending', setupForPending],
        ['failed', setupForFailure],
      ] as const

      it.each(cases)('does not trigger callback for %s tx', (_status, doSetup) => {
        const { cb } = doSetup({ showModal: true })
        fireEvent.click(screen.getByRole('listitem'))
        expect(cb).not.toHaveBeenCalledOnce()
      })

      it.each(cases)('does not close modal for %s tx', (_status, doSetup) => {
        doSetup({ showModal: true })
        fireEvent.click(screen.getByRole('listitem'))
        expect(screen.queryByRole('dialog')).toBeInTheDocument()
      })
    })
  })
})

// -----------------------
// TX WATCHER
// -----------------------

describe('TxWatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('on transaction success', () => {
    it('sets tx status to success', () => {
      const { getOnlyTx } = setupForSuccess()
      expect(getOnlyTx().status).toBe('success')
    })

    it('calls onConfirmed', () => {
      const onConfirmed = vi.fn()
      setupForSuccess({ tx: { onConfirmed } })
      expect(onConfirmed).toHaveBeenCalledOnce()
    })
  })

  describe('on transaction failure', () => {
    it('sets tx status to failed', () => {
      const { getOnlyTx } = setupForFailure()
      expect(getOnlyTx().status).toBe('failed')
    })

    it('sets error from decodeError if provided', () => {
      const { getOnlyTx } = setupForFailure({
        tx: { decodeError: () => `decoded` },
        error: 'error',
      })
      expect(getOnlyTx().error).toBe('decoded')
    })

    it('sets error.message if no decodeError', () => {
      const { getOnlyTx } = setupForFailure({ error: new Error('reverted') })
      expect(getOnlyTx().error).toBe('reverted')
    })
  })

  it('only handles the event once even if effect re-runs', () => {
    const onConfirmed = vi.fn()
    const { hook } = setupForSuccess({ tx: { onConfirmed } })

    hook.rerender()
    hook.rerender()

    expect(onConfirmed).toHaveBeenCalledOnce()
  })
})
