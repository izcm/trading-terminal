import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import type { Listing } from '@/domain/listing'

// infra deps to be mocked
import { on } from '@/lib/realtime/ws'
import { getDmrktListing } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { useWsFeed } from '../use-ws-feed'

vi.mock('@/lib/realtime/ws', () => ({ on: vi.fn() }))
vi.mock(import('@/lib/dmrkt-indexer/actions/dmrkt.get'), async importOriginal => {
  const actual = await importOriginal()
  return {
    ...actual,
    getDmrktListing: vi.fn(),
  }
})

describe('useWsFeed', () => {
  const makeFetchSuccess = () => ({ ok: true as const, data: { id: 'listing_123' } as Listing })
  const makeFetchFailure = () => ({ ok: false as const, error: 'error' })

  // function setup() {
  //     const {}
  // }
  it('calls addItem with the fetched listing on order.created', async () => {
    const addItem = vi.fn()
    const updateItem = vi.fn()

    // render hook => useWsSub => calls subscribe(fns in second argument)
    renderHook(() => useWsFeed({ addItem, updateItem }))
    const call = vi.mocked(on).mock.calls.find(([event]) => event === 'order.created')

    expect(call).toBeDefined()

    const [, handler] = call!

    // have the mock of getDmrktListing return { ok: true }
    const fetchSuccess = makeFetchSuccess()
    vi.mocked(getDmrktListing).mockResolvedValueOnce(fetchSuccess)

    // simulate ws 'order.created' event by calling handler manually
    await handler!({ chainId: 1, orderHash: '0xabc' })

    expect(addItem).toHaveBeenCalledWith('feed', fetchSuccess.data)
  })
})
