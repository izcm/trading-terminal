import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useWaitForTransactionReceipt } from 'wagmi'

import { useTx, TxProvider, Tx, AddTxParams } from '../TxProvider'

vi.mock('wagmi', () => ({
  useWaitForTransactionReceipt: vi.fn(() => ({ isError: false })),
}))

// 1. state logic addTx / updateTx / showTxs
describe('useTx', () => {
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

  it('returns empty txs list', () => {
    const { getTxs } = setup()
    expect(getTxs()).toHaveLength(0)
  })

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

  describe('updateTx', () => {
    it('updates target tx')
    it('does not affect non target txs')
  })

  describe('showTxs')
})

// 2. reaction to wagmi

// 3. UI
