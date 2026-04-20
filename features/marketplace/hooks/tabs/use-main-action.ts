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
