// rule: if it listens to events => it lives here
import { useEffect } from 'react'
import { on } from '@/lib/realtime/ws'
import { getDmrktListing, getDmrktSale } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import type { TabResource } from '../../tab-config'

const statusMap = {
  'order.cancelled': 'cancelled',
  'settlement.created': 'filled',
}

type AddItem = <K extends keyof TabResource>(tab: K, item: TabResource[K]) => void
type UpdateItem = <K extends keyof TabResource>(
  tab: K,
  id: string,
  updater: (item: TabResource[K]) => TabResource[K]
) => void

export function useWsFeed({ addItem, updateItem }: { addItem: AddItem; updateItem: UpdateItem }) {
  useEffect(() => {
    const off = on('order.created', async p => {
      const { chainId, orderHash } = p as { chainId: number; orderHash: string }

      const res = await getDmrktListing(`${chainId}:${orderHash}`)
      if (!res.ok) return

      addItem('feed', res.data)
    })

    const offs = Object.entries(statusMap).map(([event, status]) =>
      on(event, p => {
        const { chainId, orderHash } = p as { chainId: number; orderHash: string }
        const id = `${chainId}:${orderHash}`

        updateItem('feed', id, item => ({ ...item, status }))
      })
    )

    return () => {
      off()
      offs.forEach(off => off())
    }
  }, [addItem, updateItem])
}

export function useWsSales({ addItem }: { addItem: AddItem }) {
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
