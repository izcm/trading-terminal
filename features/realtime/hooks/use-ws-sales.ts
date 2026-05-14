import { useCallback } from 'react'

import { on } from '@/lib/realtime/ws'
import { getDmrktSale } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { useWsSub, type WsSubProps } from './use-ws-sub'

export function useWsSales({ addItem, updateItem }: WsSubProps) {
  useWsSub(
    { addItem, updateItem },
    useCallback(
      (addItem, updateItem) => [
        on('settlement.created', async p => {
          const { chainId, orderHash } = p as { chainId: number; orderHash: string }

          const res = await getDmrktSale(chainId, orderHash)
          if (!res.ok) return

          addItem('sales', res.data)
        }),

        on('settlement.callReconstructed', async p => {
          const { chainId, orderHash } = p as { chainId: number; orderHash: string }
          const id = `${chainId}:${orderHash}`

          const res = await getDmrktSale(chainId, orderHash)
          if (!res.ok) return

          const { txContext } = res.data
          if (txContext) updateItem('sales', id, item => ({ ...item, txContext }))
        }),
      ],
      []
    )
  )
}
