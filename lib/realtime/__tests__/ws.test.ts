import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// since ws.ts follows the singleton pattern
// test suite uses dynamic imports and resets modules between tests

let mockWs: {
  onmessage: ((e: { data: string }) => void) | null
  onerror: (() => void) | null
  onclose: (() => void) | null
}

type WsModule = typeof import('../ws')

let connectWs: WsModule['connectWs']
let on: WsModule['on']

beforeEach(async () => {
  mockWs = { onmessage: null, onerror: null, onclose: null }
  vi.stubGlobal(
    'WebSocket',
    vi.fn().mockImplementation(
      // @ts-expect-error: vitest docs recommend class for constructor mocks
      class {
        constructor() {
          return mockWs
        }
      }
    )
  )

  const mod = await import('../ws')
  connectWs = mod.connectWs
  on = mod.on
})

afterEach(() => {
  vi.resetModules()
  vi.unstubAllGlobals()
})

const url = 'ws://url'

const triggerMessage = (msg: { event: string; payload: unknown }) =>
  mockWs.onmessage?.({ data: JSON.stringify(msg) })

describe('connectWs', () => {
  it('dispatches payload to registered listeners', () => {
    const handler = vi.fn()
    const listeners = { trade: new Set([handler]) }

    connectWs(url, listeners)

    mockWs.onmessage?.({ data: JSON.stringify({ event: 'trade', payload: { item: 'ak47' } }) })

    expect(handler).toHaveBeenCalledWith({ item: 'ak47' })
  })

  // to validate onclose / onerror setting ws to null
  // => check Websocket called twice
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

describe('on', () => {
  beforeEach(() => {
    connectWs(url)
  })

  it('registers a handler for an event', () => {
    const handler = vi.fn()
    on('trade', handler)

    triggerMessage({ event: 'trade', payload: { item: 'ak47' } })

    expect(handler).toHaveBeenCalledWith({ item: 'ak47' })
  })

  it('registers multiple handlers for an event', () => {
    const handlers = [vi.fn(), vi.fn()]
    handlers.forEach(handler => on('trade', handler))

    triggerMessage({ event: 'trade', payload: { item: 'ak47' } })

    handlers.forEach(handler => expect(handler).toHaveBeenCalledWith({ item: 'ak47' }))
  })

  it('returns a function that unregisters the handler', () => {
    const handler = vi.fn()
    const off = on('trade', handler)

    off()

    triggerMessage({ event: 'trade', payload: { item: 'ak47' } })

    expect(handler).not.toHaveBeenCalledOnce()
  })
})
