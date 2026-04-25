let ws: WebSocket | null = null

type Handler = (payload: unknown) => void

const handlers: Record<string, Set<Handler>> = {}

export function connectWs(url: string) {
  if (ws) return

  ws = new WebSocket(url)

  ws.onmessage = e => {
    const parsed = JSON.parse(e.data)

    const { event, payload } = parsed

    handlers[event]?.forEach(fn => fn(payload))
  }

  ws.onclose = () => { ws = null }
  ws.onerror = () => { ws = null }
}

// register handlers
export function on(event: string, fn: Handler) {
  if (!handlers[event]) handlers[event] = new Set()

  handlers[event].add(fn)

  return () => {
    handlers[event].delete(fn)
  }
}
