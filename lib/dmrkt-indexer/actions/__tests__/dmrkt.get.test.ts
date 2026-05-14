import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'

import { getDmrktItem, getDmrktListing, getDmrktNFT, getDmrktSale } from '../dmrkt.get'
import { fetchWith, testResponseHandling } from './helpers'

vi.mock('../../config', () => ({
  getBaseUrl: () => 'http://test-api',
}))

describe('dmrkt item getters', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('wrappers', () => {
    it('getDmrktListing forwards correct params', () => {
      getDmrktListing(1, '0xabc')
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/orders/1:0xabc'))
    })

    it('getDmrktSale forwards correct params', () => {
      getDmrktSale(1, '0xabc')
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/settlements/1:0xabc'))
    })

    it('getDmrktNFT forwards correct params', () => {
      getDmrktNFT(1, '0xcollection', '42')
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/nfts/1:0xcollection:42'))
    })
  })

  describe('getDmrktItem', () => {
    const baseUrlParams = () => ({ params: 'params', id: 'id_123' }) // new reference on each call

    const fetchItemWith = (fetchImpl?: () => Promise<Response>) => {
      const { params, id } = baseUrlParams()
      return fetchWith(getDmrktItem, { input: [params, id], fetchImpl })
    }

    it('calls fetch with correct url', async () => {
      fetchItemWith()

      expect(fetch).toHaveBeenCalledExactlyOnceWith('http://test-api/api/params/id_123')
    })

    // --- RESPONSE HANDLING ---

    describe('response handling', () => {
      testResponseHandling(fetchItemWith)
    })
  })
})
