import { Result } from '../utils/result'

import { DMRKT_INDEXER_BASE_URL as baseUrl } from '../dmrkt-indexer/constants'

export type Paginated<T> = {
  items: T[]
  nextCursor: string | null
}

export async function getDmrktItems<T>(
  params: string,
  query: string,
  cursor: string | null
): Promise<Result<Paginated<T>>> {
  const searchParams = new URLSearchParams(query)

  if (cursor) {
    searchParams.set('cursor', cursor)
  }

  const url = `${baseUrl}/api/${params}?${searchParams.toString()}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` }
    }

    const data = await res.json()
    console.log(data.items)
    return {
      ok: true,
      data: {
        items: data.items as T[],
        nextCursor: data.nextCursor ?? null,
      },
    }
  } catch (err) {
    return { ok: false, error: `Error getting items: ${err}` }
  }
}
