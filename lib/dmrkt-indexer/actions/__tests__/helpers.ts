import { it, expect } from 'vitest'

import { Result } from '@/lib/utils/http'

export function testResponseHandling<TInput>(
  fetchWith: (args?: {
    fetchImpl?: () => Promise<Response>
    input?: TInput
  }) => Promise<Result<unknown>>
) {
  it('handles ok response', async () => {
    const mockResponse = { foo: 'bar' }

    const data = await fetchWith({
      fetchImpl: () => Promise.resolve({ ok: true, json: async () => mockResponse } as Response),
    })

    expect(data).toEqual({ ok: true, data: mockResponse })
  })

  it('handles non-ok response', async () => {
    const data = await fetchWith({
      fetchImpl: () => Promise.resolve({ ok: false, text: async () => 'error' } as Response),
    })

    expect(data).toEqual({ ok: false, error: 'error' })
  })

  it('handles fetch error', async () => {
    const data = await fetchWith({
      fetchImpl: () => Promise.reject('API DOWN'),
    })

    expect(data).toEqual({ ok: false, error: 'Network Error: API DOWN' })
  })
}
