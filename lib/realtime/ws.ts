let ws: WebSocket | null = null

type Handler = (payload: unknown) => void
type Listeners = Record<string, Set<Handler>>

const listeners: Listeners = {}

// lazy DI for improved testability (_handlers)
export function connectWs(url: string, _listeners: Listeners = listeners) {
  if (ws) return

  ws = new WebSocket(url)

  ws.onmessage = e => {
    const parsed = JSON.parse(e.data)

    const { event, payload } = parsed

    _listeners[event]?.forEach(fn => fn(payload))
  }

  ws.onclose = () => {
    ws = null
  }
  ws.onerror = () => {
    ws = null
  }
}

// adds local listeners
export function on(event: string, fn: Handler) {
  if (!listeners[event]) listeners[event] = new Set()

  listeners[event].add(fn)

  return () => {
    listeners[event].delete(fn)
  }
}
