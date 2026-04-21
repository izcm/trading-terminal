import { renderHook } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { useTabActions } from '../use-tab-actions'
import { Listing } from '@/domain/listing'
import { TabCtx } from '@/features/tab-config'

const { cancelOrderMock } = vi.hoisted(() => ({
  cancelOrderMock: vi.fn(),
}))

vi.mock('@/features/orders/hooks/use-cancel-order', () => {
  return { useCancelOrder: () => ({ cancelOrder: cancelOrderMock }) }
})

describe('useTabActions', () => {
  const fakeListing = (overrides?: Partial<Listing>): Listing =>
    ({
      id: '123',
      status: 'active',
      rawOrder: { nonce: 1 },
      ...overrides,
    }) as Listing

  const fakeCtx = (overrides: Partial<TabCtx>): TabCtx => ({
    isMyListing: () => false,
    isMine: () => false,
    ...overrides,
  })

  it('returns cancel function for my active listing', () => {
    const { result } = renderHook(() => useTabActions())

    const listing = fakeListing()
    const action = result.current.actions.feed(listing, fakeCtx({ isMyListing: () => true }))

    expect(action).toBeTypeOf('function')
    action?.()

    expect(cancelOrderMock).toHaveBeenCalledWith(BigInt(listing.rawOrder.nonce), listing.id)
  })

  it('returns undefined when its not my listing', () => {})
})
