let ws: WebSocket | null = null

type Handler = (payload: unknown) => void

const handlers: Record<string, Set<Handler>> = {}

export function connectWs() {
  if (ws) return

  ws = new WebSocket('ws://localhost:5001')

  ws.onmessage = e => {
    const parsed = JSON.parse(e.data)

    const { event, payload } = parsed

    handlers[event]?.forEach(fn => fn(payload))
  }
}

// register handlers
export function on(event: string, fn: Handler) {
  console.log('REGISTER', event)

  if (!handlers[event]) handlers[event] = new Set()

  handlers[event].add(fn)

  return () => {
    console.log('UNREGISTER', event)
    handlers[event].delete(fn)
  }
}
