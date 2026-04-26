import { useEffect, useLayoutEffect, useRef } from 'react'

import { on } from '@/lib/realtime/ws'
import { getDmrktListing, getDmrktSale } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { ListingStatus } from '@/domain/listing'
import { itemGetters, type TabResource } from '../../tab-config'

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

// https://vitest.dev/guide/mocking/requests.html
// ws mocks
export function useWsFeed({ addItem, updateItem }: { addItem: AddItem; updateItem: UpdateItem }) {
  const addItemRef = useRef(addItem)
  const updateItemRef = useRef(updateItem)

  // addItem (addItemAndMarkFresh) has a lot of dependencies
  // refs avoid frequent re-subsribing

  useLayoutEffect(() => {
    addItemRef.current = addItem
    updateItemRef.current = updateItem
  }, [addItem, updateItem])

  useEffect(() => {
    const off = on('order.created', async p => {
      const { chainId, orderHash } = p as { chainId: number; orderHash: string }

      const res = await getDmrktListing(`${chainId}:${orderHash}`)
      if (!res.ok) return

      addItemRef.current('feed', res.data)
    })

    const offs = Object.entries(statusMap).map(([event, status]) =>
      on(event, async p => {
        const { chainId, orderHash } = p as { chainId: number; orderHash: string }
        const id = `${chainId}:${orderHash}`

        updateItemRef.current('feed', id, item => ({ ...item, status: status as ListingStatus }))

        const res = await itemGetters['feed'](id)

        if (!res.ok) return

        const { txHash } = res.data
        if (txHash) updateItemRef.current('feed', id, item => ({ ...item, txHash }))
      })
    )

    return () => {
      off()
      offs.forEach(off => off())
    }
  }, [])
}

export function useWsSales({ addItem, updateItem }: { addItem: AddItem; updateItem: UpdateItem }) {
  const addItemRef = useRef(addItem)
  const updateItemRef = useRef(updateItem)

  // addItem (addItemAndMarkFresh) has a lot of dependencies
  // refs avoid frequent re-subsribing

  useLayoutEffect(() => {
    addItemRef.current = addItem
    updateItemRef.current = updateItem
  }, [addItem, updateItem])

  useEffect(() => {
    const offs = [
      on('settlement.created', async p => {
        const { chainId, orderHash } = p as { chainId: number; orderHash: string }

        const res = await getDmrktSale(`${chainId}:${orderHash}`)
        if (!res.ok) return

        addItemRef.current('sales', res.data)
      }),

      on('settlement.callReconstructed', async p => {
        const { chainId, orderHash } = p as { chainId: number; orderHash: string }
        const id = `${chainId}:${orderHash}`

        const res = await getDmrktSale(id)
        if (!res.ok) return

        const { txContext } = res.data
        if (txContext) updateItemRef.current('sales', id, item => ({ ...item, txContext }))
      }),
    ]

    return () => offs.forEach(off => off())
  }, [])
}
