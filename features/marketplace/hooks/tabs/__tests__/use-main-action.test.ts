import { vi, describe, it } from 'vitest'
import { useMainAction } from '../use-main-action'
import { TabActions, TabCtx, TabName, TabResource } from '@/features/tab-config'
import { renderHook } from '@testing-library/react'

// DESCRIBE: NON ACTIONABLE PATHS

// empty action def: { run: undefined, disabled: true, loading: false }

// returns empty action if selected is undefined

// returns empty action when useFillOrder says account is undefined

// returns empty action when tab is feed and selected is inactive

// ------------------------------------------------------------------

// DESCRIBE: ORDER FILL ACTIONS

//

const { fillMock } = vi.hoisted(() => ({
  fillMock: vi.fn(),
}))

vi.mock('@/features/trade/hooks/use-fill-order', () => {
  return { useFillOrder: () => ({ fill: fillMock }) }
})

describe('useMainAction', () => {
  type HookProps = Parameters<typeof useMainAction>
  type HookReturns = ReturnType<typeof useMainAction>

  const makeTabActions = (): TabActions => ({
    feed: () => vi.fn(),
    sales: () => vi.fn(),
    explore: () => vi.fn(),
  })

  const renderHookWith = ({
    tab = 'feed' as TabName,
    selected = undefined,
    ctx = undefined,
    actions = makeTabActions(),
    owned = { refetch: vi.fn() },
  }: {
    tab?: TabName
    selected?: TabResource[TabName]
    ctx?: TabCtx
    actions?: TabActions
    owned?: { refetch: () => void }
  } = {}) => renderHook(() => useMainAction(tab, selected, ctx, actions, owned)).result.current

  describe('when prerequisites are not met', () => {
    const NOOP_ACTION = {
      run: undefined,
      disabled: true,
      loading: false,
    }

    it('returns disabled when no selected item')

    it('returns disabled when user has no account')

    it('returns disabled when listing is not active')
  })

  it('uses fillOrder when on feed and listing is not mine')

  it('disables fillOrder when not fillable or inactive')

  it('returns default tab action for non-feed or owned items')
})
