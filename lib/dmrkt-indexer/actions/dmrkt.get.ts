import { Result } from '@/domain/shared/types/http'

export const baseUrl = process.env.NEXT_PUBLIC_INDEXER_ENDPOINT_URL

export type Paginated<T> = {
  initialItems: T[]
  initialCursor: string | null
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

    return {
      ok: true,
      data: {
        initialItems: data.items as T[],
        initialCursor: data.nextCursor ?? null,
      },
    }
  } catch (err) {
    return { ok: false, error: `Error getting items: ${err}` }
  }
}
