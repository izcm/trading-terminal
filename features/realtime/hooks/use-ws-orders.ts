import { useCallback } from 'react'

import { on } from '@/lib/realtime/ws'
import { getDmrktListing } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import type { ListingStatus } from '@/domain/listing'

import { useWsSub, type WsSubProps } from './use-ws-sub'

const statusMap = {
  'order.cancelled': 'cancelled',
  'settlement.created': 'filled',
}

export function useWsOrders({ addItem, updateItem }: WsSubProps) {
  useWsSub(
    { addItem, updateItem },
    useCallback(
      (addItem, updateItem) => [
        on('order.created', async p => {
          const { chainId, orderHash } = p as { chainId: number; orderHash: string }

          const res = await getDmrktListing(chainId, orderHash)
          if (!res.ok) return

          addItem('orders', res.data)
        }),

        ...Object.entries(statusMap).map(([event, status]) =>
          on(event, async p => {
            const { chainId, orderHash } = p as { chainId: number; orderHash: string }
            const id = `${chainId}:${orderHash}`

            updateItem('orders', id, item => ({
              ...item,
              status: status as ListingStatus,
            }))

            const res = await getDmrktListing(chainId, orderHash)
            if (!res.ok) return

            const { txHash } = res.data
            if (txHash) updateItem('orders', id, item => ({ ...item, txHash }))
          })
        ),
      ],
      []
    )
  )
}
