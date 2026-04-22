import { useState } from 'react'

import type { Listing } from '@/domain/listing'
import type { NFT } from '@/domain/nft'
import type { Sale } from '@/domain/sale'
import type { Hex } from '@/domain/shared/eth'

import { OrderSide } from '@/protocol/eip712'

import type { TabActions, TabCtx } from '@/features/tab-config'
import { useCancelOrder } from '@/features/orders/hooks/use-cancel-order'

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

  const openCreateOrderModal = (collection: Hex, tokenId: bigint, owned: boolean) => {
    const side = owned ? OrderSide.ASK : OrderSide.BID
    setModal({ type: 'createOrder', data: { collection, tokenId, side } })
  }

  const openSalesReceipt = (s: Sale) => {
    setModal({ type: 'receipt', data: s })
  }

  return {
    actions: {
      feed: (l: Listing, ctx?: TabCtx) => {
        if (ctx?.isMyListing?.(l) && l.status === 'active')
          return () => cancelOrder(BigInt(l.rawOrder.nonce), l.id)

        return undefined // special case
      },
      explore: (n: NFT, ctx?: TabCtx) => () => {
        const owned = ctx?.isMine?.(n)

        openCreateOrderModal(n.collection, n.tokenId, owned ?? false)
      },
      sales: (s: Sale) => () => openSalesReceipt(s),
    },
    modal,
    closeModal: () => setModal(null),
  }
}
