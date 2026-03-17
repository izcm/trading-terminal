import { Result } from '@/lib/utils/http'
import { Listing } from '@/domain/listing'

export const baseUrl = process.env.NEXT_PUBLIC_INDEXER_ENDPOINT_URL

export function getDmrktListing(id: string): Promise<Result<Listing>> {
  return getDmrktItem({ params: 'orders', id })
}

async function getDmrktItem<T>({ params, id }: { params: string; id: string }): Promise<Result<T>> {
  const url = `${baseUrl}/api/${params}/${id}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      return { ok: false, error: await res.text() }
    }

    const data = await res.json()

    return {
      ok: true,
      data: data as T,
    }
  } catch (err) {
    return { ok: false, error: `HTTP ${err}` }
  }
}
