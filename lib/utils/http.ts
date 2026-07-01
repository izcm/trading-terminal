export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

export type Page<T> = {
  items: T[]
  cursor: string | null
}

export const unwrap = <T>(r: Result<T>): T => {
  if (!r.ok) throw new Error(r.error)
  return r.data
}

async function getResponseError(res: Response): Promise<string> {
  try {
    const json = await res.json()
    return json.message ?? JSON.stringify(json)
  } catch {
    return res.text()
  }
}

export async function fetchJSON<T>(url: string, signal?: AbortSignal): Promise<Result<T>> {
  try {
    const res = await fetch(url, { signal })
    if (!res.ok) return { ok: false, error: await getResponseError(res) }
    return { ok: true, data: (await res.json()) as T }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError')
      return { ok: false, error: 'Fetch aborted' }
    return { ok: false, error: `Network Error: ${err}` }
  }
}
