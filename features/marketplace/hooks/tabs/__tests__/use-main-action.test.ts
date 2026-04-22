import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

import { TabActions, TabCtx, TabName, TabResource } from '@/features/tab-config'

import { useMainAction } from '../use-main-action'
import { fakeListing } from './fakes'

const { useFillOrder } = vi.hoisted(() => ({
  useFillOrder: { fill: vi.fn(), hasAccount: true, isFillable: true, isChecking: false },
}))

vi.mock('@/features/trade/hooks/use-fill-order', () => {
  return { useFillOrder: () => useFillOrder }
})

describe('useMainAction', () => {
  const stubActions: TabActions = {
    feed: () => undefined,
    sales: () => undefined,
    explore: () => undefined,
  }

  const renderHookWith = ({
    tab = 'feed' as TabName,
    selected = undefined,
    ctx = undefined,
    actions = stubActions,
    owned = undefined,
  }: {
    tab?: TabName
    selected?: TabResource[TabName]
    ctx?: TabCtx
    actions?: TabActions
    owned?: { refetch: () => void }
  } = {}) => renderHook(() => useMainAction(tab, selected, ctx, actions, owned)).result.current

  beforeEach(() => {
    useFillOrder.hasAccount = true
    useFillOrder.isFillable = true
    useFillOrder.isChecking = false
    vi.clearAllMocks()
  })

  describe('when prerequisites are not met', () => {
    const NOOP_ACTION = {
      run: undefined,
      disabled: true,
      loading: false,
    }

    it('returns disabled when no selected item', () => {
      const action = renderHookWith() // default selected is undefined

      expect(action).toEqual(NOOP_ACTION)
    })

    it('returns disabled when no wallet / account', () => {
      useFillOrder.hasAccount = false

      const action = renderHookWith({ selected: fakeListing({ status: 'active' }) })

      expect(action).toEqual(NOOP_ACTION)
    })

    it('returns disabled when listing is not active', () => {
      const action = renderHookWith({ selected: fakeListing({ status: 'cancelled' }) })

      expect(action).toEqual(NOOP_ACTION)
    })
  })

  it('uses fillOrder when on feed and listing is not mine', () => {})

  it('disables fillOrder when not fillable or inactive')

  it('returns default tab action for non-feed or owned items')
})
