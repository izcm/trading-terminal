import { useCallback } from 'react'

import { on } from '@/lib/realtime/ws'
import { getDmrktListing } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import type { ListingStatus } from '@/domain/listing'
import { itemGetters } from '../../tab-config'

import { useWsSub, type WsSubProps } from './use-ws-sub'

const statusMap = {
  'order.cancelled': 'cancelled',
  'settlement.created': 'filled',
}

export function useWsFeed({ addItem, updateItem }: WsSubProps) {
  useWsSub(
    { addItem, updateItem },
    useCallback(
      (addItem, updateItem) => [
        on('order.created', async p => {
          const { chainId, orderHash } = p as { chainId: number; orderHash: string }

          const res = await getDmrktListing(`${chainId}:${orderHash}`)
          if (!res.ok) return

          addItem('feed', res.data)
        }),

        ...Object.entries(statusMap).map(([event, status]) =>
          on(event, async p => {
            const { chainId, orderHash } = p as { chainId: number; orderHash: string }
            const id = `${chainId}:${orderHash}`

            updateItem('feed', id, item => ({
              ...item,
              status: status as ListingStatus,
            }))

            const res = await itemGetters['feed'](id)
            if (!res.ok) return

            const { txHash } = res.data
            if (txHash) updateItem('feed', id, item => ({ ...item, txHash }))
          })
        ),
      ],
      []
    )
  )
}
