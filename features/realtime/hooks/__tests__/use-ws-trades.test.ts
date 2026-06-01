import { describe, expect, it, vi } from 'vitest'

// infra deps to be mocked
import { on } from '@/lib/realtime/ws'
import { getDmrktTrade } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { useWsTrades } from '../use-ws-trades'
import { makeHelpers, testAddItemOnEvent } from './helpers'
import { Trade } from '@/domain/trade'

vi.mock('@/lib/realtime/ws', () => ({ on: vi.fn() }))
vi.mock(import('@/lib/dmrkt-indexer/actions/dmrkt.get'), async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    getDmrktTrade: vi.fn(),
  }
})

describe('useWsTrades', () => {
  const helpers = makeHelpers('trades', useWsTrades, vi.mocked(on))

  const { setup, getHandler, makeFetchSuccess, makeFetchFailure, somePayload } = helpers

  describe('settlement.created', () => {
    testAddItemOnEvent('settlement.created', helpers, vi.mocked(getDmrktTrade))
  })

  describe('settlement.callReconstructed', () => {
    const crEvent = 'settlement.callReconstructed'

    it('calls updateItem with txContext after fetch', async () => {
      const { updateItem } = setup()
      const handler = getHandler(crEvent)

      vi.mocked(getDmrktTrade).mockResolvedValueOnce(
        makeFetchSuccess({ txContext: { txIndex: 1 } as Trade['txContext'] })
      )

      await handler(somePayload())

      expect(updateItem.mock.results[0].value).toMatchObject({ txContext: { txIndex: 1 } })
    })

    it.each([
      ['fetch fails', makeFetchFailure()],
      ['txContext is missing', makeFetchSuccess()],
    ])('does not call updateItem when %s', async (_, fetchResult) => {
      const { updateItem } = setup()
      const handler = getHandler(crEvent)

      vi.mocked(getDmrktTrade).mockResolvedValueOnce(fetchResult)

      await handler!(somePayload())

      expect(updateItem).not.toHaveBeenCalledOnce()
    })
  })
})
