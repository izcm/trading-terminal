export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

export type Page<T> = {
  items: T[]
  nextCursor: string | null
}

export const unwrap = <T>(r: Result<T>): T => {
  if (!r.ok) throw new Error(r.error)
  return r.data
}

async function getResponseError(res: Response): Promise<string> {
  const text = await res.text()

  try {
    const json = JSON.parse(text)
    return json.message ?? JSON.stringify(json)
  } catch {
    return text
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
    console.error(`fetchJSON failed for ${url}:`, err)
    return { ok: false, error: `Network Error: ${err}` }
  }
}
