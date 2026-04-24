import { describe, it, vi, expect, beforeAll, beforeEach, afterEach } from 'vitest'

import { getDmrktItem, getDmrktListing, getDmrktNFT, getDmrktSale } from '../dmrkt.get'
import { testResponseHandling } from './helpers'

describe('dmrkt getters', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_INDEXER_API = 'http://test-api'
  })

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('wrappers', () => {
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
      input = baseUrlParams(),
    } = {}) {
      const mock = vi.fn(fetchImpl)
      vi.stubGlobal('fetch', mock)

      return getDmrktItem(input.params, input.id)
    }

    it('calls fetch with correct url', async () => {
      fetchWith()

      expect(fetch).toHaveBeenCalledExactlyOnceWith('http://test-api/api/params/id_123')
    })

    // --- RESPONSE HANDLING ---

    describe('response handling', () => {
      testResponseHandling(fetchWith)
    })
  })
})
