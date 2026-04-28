import { expect, it, Mock, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import type { TabName, TabResource } from '@/features/tab-config'
import type { WsSubProps } from '../use-ws-sub'
import { Handler } from '@/lib/realtime/ws'

export const makeHelpers = <K extends TabName>(
  tab: K,
  useSubHook: (props: WsSubProps) => void,
  on: Mock
) => {
  function setup() {
    const addItem = vi.fn()
    const updateItem = vi.fn((_tab, _id, updater) => updater({})) // call the provided updater with an empty item

    // render hook => useWsSub => calls subscribe(fns in second argument)
    const hook = renderHook(() => useSubHook({ addItem, updateItem }))

    return {
      hook,
      addItem,
      updateItem,
    }
  }

  function getHandler(eventName: string): Handler {
    const call = vi.mocked(on).mock.calls.find(([event]) => event === eventName)
    expect(call).toBeDefined()

    const [, handler] = call!
    expect(handler).toBeTypeOf('function')

    return handler
  }

  const makeFetchSuccess = (additional: Partial<TabResource[K]> = {}) => ({
    ok: true as const,
    data: { id: 'listing_123', ...additional } as TabResource[K],
  })
  const makeFetchFailure = () => ({ ok: false as const, error: 'error' })

  const somePayload = () => ({ chainId: 1, orderHash: '0xabc' })

  return { setup, getHandler, makeFetchFailure, makeFetchSuccess, somePayload, tab }
}

export function testAddItemOnEvent(
  event: string,
  helpers: ReturnType<typeof makeHelpers>,
  getItem: Mock
) {
  const { setup, getHandler, makeFetchSuccess, makeFetchFailure, somePayload, tab } = helpers

  it('calls addItem with the fetched item', async () => {
    const { addItem } = setup()
    const handler = getHandler(event)

    // mock returns { ok: true }
    const fetchSuccess = makeFetchSuccess()
    vi.mocked(getItem).mockResolvedValueOnce(fetchSuccess)

    // simulate ws event by calling handler manually
    await handler!(somePayload())

    expect(addItem).toHaveBeenCalledWith(tab, fetchSuccess.data)
  })

  it('does not call addItem when fetch fails', async () => {
    const { addItem } = setup()
    const handler = getHandler(event)

    const fetchFailure = makeFetchFailure()
    vi.mocked(getItem).mockResolvedValueOnce(fetchFailure)

    await handler!(somePayload())

    expect(addItem).not.toHaveBeenCalled()
  })
}
