import { describe, it, vi, expect, beforeAll, beforeEach } from 'vitest'

import { getDmrktItem, getDmrktListing, getDmrktNFT, getDmrktSale } from '../dmrkt.get'

describe('dmrkt getters', () => {
  const mockResponse = { foo: 'bar' }

  beforeAll(() => {
    process.env.NEXT_PUBLIC_INDEXER_API = 'http://test-api'
  })

  describe('wrappers', () => {
    beforeEach(() => (global.fetch = vi.fn()))

    it('getDmrktListing forwards correct params', () => {
      getDmrktListing('abc')
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/orders/abc'))
    })

    it('getDmrktSale forwards correct params', () => {
      getDmrktSale('abc')
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/settlements/abc'))
    })

    it('getDmrktNFT forwards correct params', () => {
      getDmrktNFT('abc')
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/nfts/abc'))
    })
  })

  describe('getDmrktItem', () => {
    const baseUrlParams = () => ({ params: 'params', id: 'id_123' }) // new reference on each call

    function fetchWith({
      fetchImpl = () => Promise.resolve({} as Response),
      urlParams = baseUrlParams(),
    }: {
      fetchImpl?: () => Promise<Response>
      urlParams?: { params: string; id: string }
    } = {}) {
      global.fetch = vi.fn(fetchImpl)

      return getDmrktItem(urlParams)
    }

    it('calls fetch with correct params', async () => {
      fetchWith()

      expect(fetch).toHaveBeenCalledExactlyOnceWith('http://test-api/api/params/id_123')
    })

    // --- HAPPY ---

    it('returns ok: true and data when response returns ok', async () => {
      const data = await fetchWith({
        fetchImpl: () => Promise.resolve({ ok: true, json: async () => mockResponse } as Response),
      })

      expect(data).toEqual({ ok: true, data: mockResponse })
    })

    // --- SAD ---

    it('returns ok: false and response text when response is not ok', async () => {
      const data = await fetchWith({
        fetchImpl: () => Promise.resolve({ ok: false, text: async () => 'error' } as Response),
      })

      expect(data).toEqual({ ok: false, error: 'error' })
    })

    it('returns ok: false and response text when fetch is rejected', async () => {
      const data = await fetchWith({
        fetchImpl: () => Promise.reject('API DOWN'),
      })

      expect(data).toEqual({ ok: false, error: 'Network Error: API DOWN' })
    })
  })
})
