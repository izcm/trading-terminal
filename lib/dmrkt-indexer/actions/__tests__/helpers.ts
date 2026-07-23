import { it, expect, vi, describe } from 'vitest'

import { Result } from '@/lib/utils/http'

export function fetchWith<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  {
    fetchImpl = () => Promise.resolve({} as Response),
    input,
  }: {
    fetchImpl?: () => Promise<Response>
    input?: TArgs
  } = {}
) {
  const mock = vi.fn(fetchImpl)
  vi.stubGlobal('fetch', mock)

  return fn(...(input ?? ([] as unknown as TArgs)))
}

export function testSuccessHandling(
  action: (fetchImpl?: () => Promise<Response>) => Promise<Result<unknown>>
) {
  it('handles ok response', async () => {
    const mockResponse = { foo: 'bar' }
    const data = await action(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockResponse,
      } as Response)
    )

    expect(data).toEqual({ ok: true, data: mockResponse })
  })
}

export function testErrorHandling(
  action: (fetchImpl?: () => Promise<Response>) => Promise<Result<unknown>>
) {
  describe('non-ok response', () => {
    it('sets error to json message when defined', async () => {
      const data = await action(() =>
        Promise.resolve({
          ok: false,
          json: async () => ({ message: 'json error' }),
          text: async () => JSON.stringify({ message: 'json error' }),
        } as Response)
      )

      expect(data).toEqual({ ok: false, error: 'json error' })
    })

    it('sets error to response text when json message undefined', async () => {
      const data = await action(() =>
        Promise.resolve({ ok: false, text: async () => 'error' } as Response)
      )

      expect(data).toEqual({ ok: false, error: 'error' })
    })
  })

  it('handles fetch error', async () => {
    const data = await action(() => Promise.reject('API DOWN'))

    expect(data).toEqual({ ok: false, error: 'Network Error: API DOWN' })
  })
}

export function testAbortHandling(
  action: (fetchImpl?: () => Promise<Response>) => Promise<Result<unknown>>
) {
  it('returns aborted error when signal is aborted', async () => {
    const result = await action(() => Promise.reject(new DOMException('aborted', 'AbortError')))
    expect(result).toEqual({ ok: false, error: 'Fetch aborted' })
  })
}

export function testResponseHandling(
  action: (fetchImpl?: () => Promise<Response>) => Promise<Result<unknown>>
) {
  testSuccessHandling(action)
  testErrorHandling(action)
}
