// todo: make this generic
// => inject wslUrl from ws hook implementation

let ws: WebSocket | null = null

type Handler = (payload: unknown) => void

const handlers: Record<string, Set<Handler>> = {}

const wsURL = process.env.NEXT_PUBLIC_INDEXER_WS

if (!wsURL) throw new Error('Missing NEXT_PUBLIC_INDEXER_WS')

export function connectWs() {
  if (ws || !wsURL) return

  ws = new WebSocket(wsURL)

  ws.onmessage = e => {
    const parsed = JSON.parse(e.data)

    const { event, payload } = parsed

    handlers[event]?.forEach(fn => fn(payload))
  }
}

// register handlers
export function on(event: string, fn: Handler) {
  if (!handlers[event]) handlers[event] = new Set()

  handlers[event].add(fn)

  return () => {
    handlers[event].delete(fn)
  }
}
