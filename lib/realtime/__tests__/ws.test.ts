import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { connectWs } from '../ws'

// https://vitest.dev/guide/mocking/requests.html
// MockServiceWorker for potential integration tests later

describe('connectWs', () => {
  type MockWs = {
    onmessage: ((e: { data: string }) => void) | null
    onerror: (() => void) | null
    onclose: (() => void) | null
  }

  let mockWs: MockWs
  const url = 'ws://url'

  beforeEach(() => {
    mockWs = { onmessage: null, onerror: null, onclose: null }
    vi.stubGlobal(
      'WebSocket',
      vi.fn(function () {
        return mockWs
      })
    )
  })

  afterEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  // to validate onclose / onerror setting ws to null => check Websocket called twice

  it.each([
    ['on error', () => mockWs.onerror?.()],
    ['on close', () => mockWs.onclose?.()],
  ])('resets ws %s', (_, fn) => {
    connectWs(url)
    fn()
    connectWs(url)

    expect(WebSocket).toHaveBeenCalledTimes(2)
  })
})
