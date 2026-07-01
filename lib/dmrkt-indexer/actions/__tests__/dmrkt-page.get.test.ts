import { describe, vi, expect, beforeEach, it, afterEach } from 'vitest'

import { fetchWith, testAbortHandling, testErrorHandling } from './helpers'
import { getDmrktPage } from '../dmrkt-page.get'

vi.mock('../../config', () => ({
  getBaseUrl: () => 'http://test-api',
}))

describe('dmrkt page getters', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('getDmrktItems', () => {
    const baseInput = () => ({
      params: 'params',
      query: new URLSearchParams('status=active&topic=test'),
    })

    describe('response handling', () => {
      const fetchPageWith = (fetchImpl?: () => Promise<Response>) =>
        fetchWith(getDmrktPage, { input: [baseInput()], fetchImpl })

      it('handles ok response', async () => {
        const mockResponse = { items: ['foo', 'bar'], nextCursor: 'cursor_123' }

        const data = await fetchPageWith(() =>
          Promise.resolve({ ok: true, json: async () => mockResponse } as Response)
        )

        expect(data).toEqual({ ok: true, data: { items: ['foo', 'bar'], cursor: 'cursor_123' } })
      })

      testErrorHandling(fetchPageWith)
    })

    testAbortHandling(fetchImpl => fetchWith(getDmrktPage, { input: [baseInput()], fetchImpl }))

    it('forwards signal to fetch', async () => {
      const controller = new AbortController()
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ items: [], nextCursor: null }),
      } as Response)

      await getDmrktPage({ ...baseInput(), signal: controller.signal })

      expect(fetch).toHaveBeenCalledWith(expect.any(String), { signal: controller.signal })
    })
  })
})
