import { act } from 'react'

import { vi, describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'

import type { Trade } from '@/domain/trade'
import type { NFT } from '@/domain/nft'

import { OrderSide } from '@/protocol/eip712'

import { useTabActions } from '../use-tab-actions'
import { fakeListing, fakeCtx } from '../../../../../lib/utils/fakes'

const { cancelOrderMock } = vi.hoisted(() => ({
  cancelOrderMock: vi.fn(),
}))

vi.mock('@/features/orders/hooks/use-cancel-order', () => {
  return { useCancelOrder: () => ({ cancelOrder: cancelOrderMock }) }
})

describe('useTabActions', () => {
  const initHook = () => renderHook(() => useTabActions())

  const setup = () => {
    const hook = initHook()

    return {
      hook,
      actions: hook.result.current.actions,
      getModal: () => hook.result.current.modal,
      getCloseModal: () => hook.result.current.closeModal,
    }
  }

  describe('actions', () => {
    describe('feed', () => {
      it('returns cancel function for my active listing', () => {
        const { actions } = setup()

        const listing = fakeListing()

        const action = actions.feed(listing, fakeCtx({ isMyListing: () => true }))

        expect(action).toBeTypeOf('function')
        action?.()

        expect(cancelOrderMock).toHaveBeenCalledWith(BigInt(listing.rawOrder.nonce), listing.id)
      })

      it.each([
        [
          'listing not active',
          fakeListing({ status: 'cancelled' }),
          fakeCtx({ isMyListing: () => true }),
        ],
        ['not my listing', fakeListing(), fakeCtx()],
      ])('returns undefined when %s', (_, listing, ctx) => {
        const { actions } = setup()

        const action = actions.feed(listing, ctx)

        expect(action).toBeUndefined()
      })
    })

    describe('explore', () => {
      it.each([
        ['ASK', () => true, OrderSide.ASK],
        ['BID', () => false, OrderSide.BID],
      ])('opens createOrder modal with %s when isMine is %s', (_, isMine, side) => {
        const { actions, getModal } = setup()

        const fakeNft = () => ({ collection: '0xabc123', tokenId: 1n }) as unknown as NFT
        const { collection, tokenId } = fakeNft()

        act(() => actions.explore(fakeNft(), { isMine })?.())

        expect(getModal()).toEqual({
          type: 'createOrder',
          data: { collection, tokenId, side: side },
        })
      })
    })

    describe('trades', () => {
      it('opens receipt modal', () => {
        const { actions, getModal } = setup()

        const trade = { id: 'trade_123' } as Trade

        act(() => actions.trades(trade)?.())

        expect(getModal()).toEqual({ type: 'receipt', data: trade })
      })
    })
  })

  describe('modal', () => {
    it('is null by default', () => {
      const { getModal } = setup()
      expect(getModal()).toBeNull()
    })
  })

  describe('closeModal', () => {
    it('sets modal to null', () => {
      const { getModal, getCloseModal, actions } = setup()

      // do some action that sets modal content
      act(() => actions.trades({ id: 'trade_123' } as Trade)?.())
      expect(getModal()).not.toBeNull()

      // now close modal and expect to be null
      act(() => getCloseModal()())
      expect(getModal()).toBeNull()
    })
  })
})
