import { useCallback } from 'react'

import { on } from '@/lib/realtime/ws'
import { getDmrktTrade } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { useWsSub, type WsSubProps } from './use-ws-sub'

export function useWsTrades({ addItem, updateItem }: WsSubProps) {
  useWsSub(
    { addItem, updateItem },
    useCallback(
      (addItem, updateItem) => [
        on('settlement.created', async p => {
          const { chainId, orderHash } = p as { chainId: number; orderHash: string }

          const res = await getDmrktTrade(chainId, orderHash)
          if (!res.ok) return

          addItem('trades', res.data)
        }),

        on('settlement.callReconstructed', async p => {
          const { chainId, orderHash } = p as { chainId: number; orderHash: string }
          const id = `${chainId}:${orderHash}`

          const res = await getDmrktTrade(chainId, orderHash)
          if (!res.ok) return

          const { txContext } = res.data
          if (txContext) updateItem('trades', id, item => ({ ...item, txContext }))
        }),
      ],
      []
    )
  )
}
