import { describe, expect, it, vi } from 'vitest'

// infra deps to be mocked
import { on } from '@/lib/realtime/ws'
import { getDmrktListing } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { useWsOrders } from '../use-ws-orders'
import { makeHelpers, testAddItemOnEvent } from './helpers'

vi.mock('@/lib/realtime/ws', () => ({ on: vi.fn() }))
vi.mock(import('@/lib/dmrkt-indexer/actions/dmrkt.get'), async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    getDmrktListing: vi.fn(),
  }
})

describe('useWsOrders', () => {
  const helpers = makeHelpers('orders', useWsOrders, vi.mocked(on))
  const { setup, getHandler, makeFetchSuccess, makeFetchFailure, somePayload } = helpers

  describe('order.created', () => {
    testAddItemOnEvent('order.created', helpers, vi.mocked(getDmrktListing))
  })

  describe('status events', () => {
    it.each([
      ['order.cancelled', 'cancelled'],
      ['settlement.created', 'filled'],
    ])(
      'sets status immediately and then updates txHash if successfull fetch on %s',
      async (event, status) => {
        const { updateItem } = setup()
        const handler = getHandler(event)

        const fetchSuccess = makeFetchSuccess({ txHash: '0xabc' })
        vi.mocked(getDmrktListing).mockResolvedValueOnce(fetchSuccess)

        await handler!(somePayload())

        expect(updateItem).toHaveBeenCalledTimes(2)

        expect(updateItem.mock.results[0].value).toMatchObject({ status })
        expect(updateItem.mock.results[1].value).toMatchObject({ txHash: '0xabc' })
      }
    )

    it.each([
      ['fetch fails', makeFetchFailure()],
      ['txHash is missing', makeFetchSuccess()],
    ])('does not call updateItem a second time when %s', async (_, fetchResult) => {
      const { updateItem } = setup()
      const handler = getHandler('order.cancelled')

      vi.mocked(getDmrktListing).mockResolvedValueOnce(fetchResult)

      await handler!(somePayload())

      expect(updateItem).toHaveBeenCalledTimes(1)
    })
  })
})
