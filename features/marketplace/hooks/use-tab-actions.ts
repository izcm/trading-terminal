import { useState } from 'react'

import type { Listing } from '@/domain/listing'
import type { NFT } from '@/domain/nft'
import type { Sale } from '@/domain/sale'

import { OrderSide } from '@/protocol/eip712'

import type { TabActions, TabCtx } from '@/features/tab-config'
import { useCancelOrder } from '@/features/orders/hooks/use-cancel-order'

type ModalState =
  | { type: 'receipt'; data: Sale }
  | { type: 'createOrder'; data: { side: OrderSide; collection: string; tokenId: bigint } }
  | null

type UseTabActionsReturn = {
  actions: TabActions
  modal: ModalState
  closeModal: () => void
}
export function useTabActions(): UseTabActionsReturn {
  const [modal, setModal] = useState<ModalState>(null)

  const { cancelOrder } = useCancelOrder()

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
      explore: (n: NFT, ctx?: TabCtx<'explore'>) => () => {},
      sales: (s: Sale, ctx?: TabCtx<'sales'>) => () => openSalesReceipt(s),
    },
    modal,
    closeModal: () => setModal(null),
  }
}
