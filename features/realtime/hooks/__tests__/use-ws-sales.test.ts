import { describe, it, vi } from 'vitest'

// infra deps to be mocked
import { on } from '@/lib/realtime/ws'
import { getDmrktSale } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { useWsSales } from '../use-ws-sales'
import { makeHelpers, testAddItemOnEvent } from './helpers'

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
})
