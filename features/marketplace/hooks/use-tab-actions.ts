import { useState } from 'react'

import type { Listing } from '@/domain/listing'
import type { NFT } from '@/domain/nft'
import type { Sale } from '@/domain/sale'
import type { Hex } from '@/domain/shared/eth'

import { OrderSide } from '@/protocol/eip712'

import type {
  ResolvedAction,
  TabActions,
  TabCtx,
  TabName,
  TabResource,
} from '@/features/tab-config'
import { useCancelOrder } from '@/features/orders/hooks/use-cancel-order'
import { useFillOrder } from '@/features/trade/hooks/use-fill-order'

type ModalState =
  | { type: 'receipt'; data: Sale }
  | { type: 'createOrder'; data: { collection: Hex; tokenId: bigint; side: OrderSide } }
  | null

type UseTabActionsReturn = {
  actions: TabActions
  modal: ModalState
  closeModal: () => void
}
export function useTabActions(): UseTabActionsReturn {
  const [modal, setModal] = useState<ModalState>(null)

  const { cancelOrder } = useCancelOrder()

  const openCreateOrderModal = (n: NFT, owned: boolean) => {
    let side

    const props = {
      collection: n.collection,
      tokenId: n.tokenId,
    }

    if (owned) {
      side = OrderSide.ASK
    } else {
      side = OrderSide.BID
    }

    setModal({ type: 'createOrder', data: { ...props, side } })
  }

  const openSalesReceipt = (s: Sale) => {
    setModal({ type: 'receipt', data: s })
  }

  return {
    actions: {
      feed: (l: Listing, ctx?: TabCtx<'feed'>) => {
        if (ctx?.isMyListing?.(l) && l.status === 'active')
          return () => cancelOrder(BigInt(l.rawOrder.nonce), l.id)

        return undefined // special case
      },
      explore: (n: NFT, ctx?: TabCtx<'explore'>) => () => {
        const owned = ctx?.isMyToken?.(n)

        openCreateOrderModal(n, owned ?? false)
      },
      sales: (s: Sale) => () => openSalesReceipt(s),
    },
    modal,
    closeModal: () => setModal(null),
  }
}

/**
 * Since feed has a special case, this hoook avoids too much inline logic in parent
 */

type OwnedActions = {
  refetch: () => void
}

export function useMainAction<K extends TabName>(
  tab: K,
  selected: TabResource[K] | undefined,
  ctx: TabCtx<K> | undefined,
  actions: TabActions,
  owned: OwnedActions
): ResolvedAction {
  const isFeed = tab === 'feed'
  const listing = isFeed ? (selected as TabResource['feed']) : undefined

  // const fillOrder = useFillOrder(listing?.rawOrder, listing?.id, owned.refetch)
  const fillOrder = useFillOrder(listing?.rawOrder, listing?.id, () => owned.refetch)

  if (!selected) {
    return { run: undefined, disabled: true, loading: false }
  }

  // if listing is inactive => disable and do nothing
  if (isFeed && listing && listing.status !== 'active') {
    return {
      run: undefined,
      disabled: true,
      loading: false,
    }
  }

  // if tab is feed + a listing is selected + user is not maker of selected listing
  if (isFeed && listing && !ctx?.isMyListing?.(listing)) {
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
