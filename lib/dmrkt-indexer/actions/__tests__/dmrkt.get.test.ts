import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'

import { getDmrktItem, getDmrktListing, getDmrktNFT, getDmrktSale } from '../dmrkt.get'
import { fetchWith, testAbortHandling, testResponseHandling } from './helpers'

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
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/orders/1:0xabc'), expect.any(Object))
    })

    it('getDmrktSale forwards correct params', () => {
      getDmrktSale(1, '0xabc')
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/settlements/1:0xabc'), expect.any(Object))
    })

    it('getDmrktNFT forwards correct params', () => {
      getDmrktNFT(1, '0xcollection', '42')
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/nfts/1:0xcollection:42'), expect.any(Object))
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

      expect(fetch).toHaveBeenCalledExactlyOnceWith('http://test-api/api/params/id_123', expect.any(Object))
    })

    it('forwards signal to fetch', async () => {
      const controller = new AbortController()
      vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({}) } as Response)

      await getDmrktItem('params', 'id_123', controller.signal)

      expect(fetch).toHaveBeenCalledWith(expect.any(String), { signal: controller.signal })
    })

    testAbortHandling(fetchImpl => fetchWith(getDmrktItem, { input: ['params', 'id_123'], fetchImpl }))

    // --- RESPONSE HANDLING ---

    describe('response handling', () => {
      testResponseHandling(fetchItemWith)
    })
  })
})
