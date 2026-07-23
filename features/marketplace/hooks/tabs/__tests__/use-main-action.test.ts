import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

import { TabActions, TabCtx, TabName, TabResource } from '@/features/tab-config'

import { useMainAction } from '../use-main-action'
import { fakeCtx, fakeListing } from '@/lib/utils/fakes'

const { fillOrder, useFillOrder } = vi.hoisted(() => {
  const fillOrder = { fill: vi.fn(), hasAccount: true, isFillable: true, isChecking: false }
  return { fillOrder, useFillOrder: vi.fn(() => fillOrder) }
})

vi.mock('@/features/trade/hooks/use-fill-order', () => ({ useFillOrder }))

describe('useMainAction', () => {
  const stubActions: TabActions = {
    orders: () => undefined,
    trades: () => undefined,
    nfts: () => undefined,
  }

  const renderHookWith = ({
    tab = 'orders' as TabName,
    selected = undefined,
    ctx = undefined,
    actions = stubActions,
    owned = { refetch: () => undefined },
  }: {
    tab?: TabName
    selected?: TabResource[TabName]
    ctx?: TabCtx
    actions?: TabActions
    owned?: { refetch: () => void }
  } = {}) => renderHook(() => useMainAction(tab, selected, ctx, actions, owned)).result.current

  beforeEach(() => {
    fillOrder.hasAccount = true
    fillOrder.isFillable = true
    fillOrder.isChecking = false
  })

  describe('when prerequisites are not met', () => {
    const NOOP_ACTION = {
      run: undefined,
      disabled: true,
      loading: false,
    }

    it('returns no-op when no selected item', () => {
      const action = renderHookWith() // default selected is undefined

      expect(action).toEqual(NOOP_ACTION)
    })

    it('returns no-op when no wallet / account', () => {
      fillOrder.hasAccount = false

      const action = renderHookWith({ selected: fakeListing() }) // defaults to active listing

      expect(action).toEqual(NOOP_ACTION)
    })

    it('returns no-op when listing is not active', () => {
      const action = renderHookWith({ selected: fakeListing({ status: 'cancelled' }) })

      expect(action).toEqual(NOOP_ACTION)
    })
  })

  describe('fill order actions', () => {
    const fillOrderSetup = () =>
      renderHookWith({
        selected: fakeListing(), // status = active
        ctx: fakeCtx(), // isMyListing = false
      })

    it('uses fillOrder when on orders and listing is not mine', () => {
      const action = fillOrderSetup()

      expect(action).toEqual({
        run: fillOrder.fill,
        disabled: false,
        loading: false,
      })
    })

    it('disables fillOrder when not fillable', () => {
      fillOrder.isFillable = false
      const action = fillOrderSetup()

      expect(action).toEqual({
        run: fillOrder.fill,
        disabled: true,
        loading: false,
      })
    })
  })

  it('forwards correct params to useFillOrder', () => {
    const listing = fakeListing()
    const refetch = () => undefined

    renderHookWith({ selected: listing, owned: { refetch } })

    expect(useFillOrder).toHaveBeenCalledWith(listing.rawOrder, listing.id, refetch)
  })

  it.each(['trades', 'nfts'])('returns default tab action for %s tab', tab => {
    const mockRun = () => undefined

    const action = renderHookWith({
      tab: tab as TabName,
      selected: { id: '123' } as TabResource[TabName],
      ctx: fakeCtx(),
      actions: { ...stubActions, [tab]: () => mockRun },
    })

    expect(action).toEqual({ run: mockRun, disabled: false, loading: false })
  })

  it('returns default tab action for orders and owned item', () => {
    const mockRun = () => undefined

    const action = renderHookWith({
      selected: fakeListing(),
      ctx: fakeCtx({ isMyListing: () => true }),
      actions: { ...stubActions, orders: () => mockRun },
    })

    expect(action).toEqual({ run: mockRun, disabled: false, loading: false })
  })
})
