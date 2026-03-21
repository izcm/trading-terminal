// rule: if it listens to events => it lives here
import { useEffect } from 'react'
import { on } from '@/lib/realtime/ws'
import { getDmrktListing, getDmrktSale } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { TabResource } from '../tab-config'

export function useWsFeed(
  addItem: <K extends keyof TabResource>(tab: K, item: TabResource[K]) => void
) {
  useEffect(() => {
    const off = on('order.created', async p => {
      const payload = p as { chainId: number; orderHash: string }

      const res = await getDmrktListing(`${payload.chainId}:${payload.orderHash}`)
      if (!res.ok) return

      addItem('feed', res.data)
    })

    return () => off()
  }, [addItem])
}

export function useWsSales(
  addItem: <K extends keyof TabResource>(tab: K, item: TabResource[K]) => void
) {
  useEffect(() => {
    const off = on('settlement.created', async p => {
      const payload = p as { chainId: number; orderHash: string }

      const res = await getDmrktSale(`${payload.chainId}:${payload.orderHash}`)
      if (!res.ok) return

      addItem('sales', res.data)
    })

    return () => off()
  }, [addItem])
}
