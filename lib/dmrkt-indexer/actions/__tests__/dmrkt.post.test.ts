import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import * as viem from 'viem'

import { Hex } from '@/domain/shared/eth'
import { fakeOrderCore } from '@/lib/utils/fakes'

import { postDmrktOrder } from '../dmrkt.post'
import { testResponseHandling } from './helpers'

vi.mock('viem', () => ({
  parseSignature: vi.fn().mockReturnValue({ r: '0xa', s: '0xb', v: 27n }),
}))

vi.mock('../../config', () => ({
  getBaseUrl: () => 'http://test-api',
}))

describe('postDmrktOrder', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const makeOrderInput = (overrides = {}) => ({
    chainId: 1,
    order: fakeOrderCore(),
    signature: '0xwhatever' as Hex,
    ...overrides,
  })

  function fetchWith({
    fetchImpl = () => Promise.resolve({} as Response),
    input = makeOrderInput(),
  } = {}) {
    const { chainId, order, signature } = input

    const mock = vi.fn(fetchImpl)
    vi.stubGlobal('fetch', mock)

    return postDmrktOrder(chainId, order, signature)
  }

  describe('response handling', () => {
    testResponseHandling(fetchWith)
  })

  it('calls parseSignature with hex signature', async () => {
    await postDmrktOrder(1, fakeOrderCore(), '0xwhatever')

    expect(viem.parseSignature).toHaveBeenCalledWith('0xwhatever')
  })

  describe('fetch request', () => {
    async function getFetchArgs(input = makeOrderInput()) {
      const { chainId, order, signature } = input

      await postDmrktOrder(chainId, order, signature as Hex)

      const [url, options] = vi.mocked(fetch).mock.calls[0]!
      return { url, options }
    }

    it('sets correct url', async () => {
      const { url } = await getFetchArgs()

      expect(url).toBe('http://test-api/api/orders')
    })

    it('sets method to POST', async () => {
      const { options } = await getFetchArgs()

      expect(options?.method).toBe('POST')
    })

    it('sets x-chain-id as fetch header', async () => {
      const { options } = await getFetchArgs()

      expect(options?.headers).toMatchObject({ 'x-chain-id': '1' })
    })

    it('includes a string body', async () => {
      const { options } = await getFetchArgs()

      expect(options?.body).toBeTypeOf('string')
    })

    it('body includes parsed signature', async () => {
      const { options } = await getFetchArgs()
      const body = JSON.parse(options!.body as string)

      expect(body).toMatchObject({
        signature: { r: '0xa', s: '0xb', v: '27' },
      })
    })

    it('body includes order', async () => {
      const { options } = await getFetchArgs()
      const body = JSON.parse(options!.body as string)

      expect(body).toMatchObject({
        ...fakeOrderCore(),
      })
    })
  })
})
