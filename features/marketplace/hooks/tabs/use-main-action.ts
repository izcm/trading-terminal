import type {
  TabCtx,
  TabName,
  TabResource,
  TabActions,
  ResolvedAction,
} from '@/features/tab-config'

import { useFillOrder } from '@/features/trade/hooks/use-fill-order'

type OwnedActions = {
  refetch: () => void
}

/**
 * Resolves the primary action for the currently selected tab item.
 *
 * Handles two special cases before falling back to the tab's default action:
 * 1. No selection or missing account → action disabled
 * 2. Feed tab + active listing + viewer is not the maker → fill-order action
 *
 * @param tab - Active tab name (drives which resource type `selected` is)
 * @param selected - The item currently in view, or `undefined` if none
 * @param ctx - Tab context supplying ownership and rule checks (e.g. `isMine`)
 * @param actions - Map of default actions keyed by tab name
 * @param owned - Callbacks for side effects after inventory changes (e.g. after a sale)
 * @returns `ResolvedAction` — the action to run, whether it is disabled, and whether it is loading
 */

export function useMainAction<K extends TabName>(
  tab: K,
  selected: TabResource[K] | undefined,
  ctx: TabCtx | undefined,
  actions: TabActions,
  owned: OwnedActions
): ResolvedAction {
  const isFeed = tab === 'feed'
  const listing = isFeed ? (selected as TabResource['feed']) : undefined

  const fillOrder = useFillOrder(listing?.rawOrder, listing?.id, owned.refetch)

  if (!selected) {
    return { run: undefined, disabled: true, loading: false }
  }

  // if listing is inactive => disable and do nothing
  if (!fillOrder.hasAccount || (isFeed && listing && listing.status !== 'active')) {
    return {
      run: undefined,
      disabled: true,
      loading: false,
    }
  }

  // if tab is feed + a listing is selected + user is not maker of selected listing
  if (isFeed && listing && !ctx?.isMine(listing)) {
    return {
      run: fillOrder.fill,
      disabled: !fillOrder.isFillable || listing.status !== 'active',
      loading: !!fillOrder.isChecking,
    }
  }

  return {
    run: actions[tab](selected, ctx),
    disabled: false,
    loading: false,
  }
}
