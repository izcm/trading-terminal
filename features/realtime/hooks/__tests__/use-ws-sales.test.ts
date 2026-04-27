import { describe, expect, it, vi } from 'vitest'

// infra deps to be mocked
import { on } from '@/lib/realtime/ws'
import { getDmrktSale } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { useWsSales } from '../use-ws-sales'
import { makeHelpers, testAddItemOnEvent } from './helpers'
import { Sale } from '@/domain/sale'

vi.mock('@/lib/realtime/ws', () => ({ on: vi.fn() }))
vi.mock(import('@/lib/dmrkt-indexer/actions/dmrkt.get'), async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    getDmrktSale: vi.fn(),
  }
})

describe('useWsSales', () => {
  const helpers = makeHelpers('sales', useWsSales, vi.mocked(on))

  const { setup, getHandler, makeFetchSuccess, makeFetchFailure, somePayload } = helpers

  describe('settlement.created', () => {
    testAddItemOnEvent('settlement.created', helpers, vi.mocked(getDmrktSale))
  })

  describe('settlement.callReconstructed', () => {
    const crEvent = 'settlement.callReconstructed'

    it('calls updateItem with txContext after fetch', async () => {
      const { updateItem } = setup()
      const handler = getHandler(crEvent)

      vi.mocked(getDmrktSale).mockResolvedValueOnce(
        makeFetchSuccess({ txContext: { txIndex: 1 } as Sale['txContext'] })
      )

      await handler(somePayload())

      console.log(updateItem.mock.results)
      expect(updateItem.mock.results[0].value).toMatchObject({ txContext: { txIndex: 1 } })
    })

    it.each([
      ['fetch fails', makeFetchFailure()],
      ['txContext is missing', makeFetchSuccess()],
    ])('does not call updateItem when %s', async (_, fetchResult) => {
      const { updateItem } = setup()
      const handler = getHandler(crEvent)

      vi.mocked(getDmrktSale).mockResolvedValueOnce(fetchResult)

      await handler!(somePayload())

      expect(updateItem).not.toHaveBeenCalled()
    })
  })
})
