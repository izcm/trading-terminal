import { describe, it, vi, expect, beforeAll } from 'vitest'
import { getDmrktItem } from '../dmrkt.get'

describe('dmrkt getters', () => {
  const mockResponse = { foo: 'bar' }

  beforeAll(() => {
    process.env.NEXT_PUBLIC_INDEXER_API = 'http://test-api'
  })

  describe('getDmrktItem', () => {
    const fetchParams = () => ({ params: 'params', id: 'id_123' }) // new reference on each call

    it('calls fetch with correct params', async () => {
      global.fetch = vi.fn()

      await getDmrktItem(fetchParams())

      expect(fetch).toHaveBeenCalledWith('http://test-api/api/params/id_123')
    })

    it('returns ok: true and data when response returns ok', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({ ok: true, json: async () => mockResponse } as Response)
      )

      const data = await getDmrktItem(fetchParams())

      expect(data).toEqual({ ok: true, data: mockResponse })
    })
  })
})
