import type { Page, Result } from '@/lib/utils/http'

import type { Sale } from '@/domain/sale'
import type { Listing } from '@/domain/listing'
import type { NFTCollection } from '@/domain/nft-collection'

import { toListing, type ListingDTO } from '../types/listing-dto'

export const baseUrl = process.env.NEXT_PUBLIC_INDEXER_ENDPOINT_URL

export async function getDmrktListings(
  limit: number = 10,
  cursor: string | null = null
): Promise<Result<Page<Listing>>> {
  const query = new URLSearchParams({
    limit: String(limit),
    status: 'active',
  })

  query.append('include', 'nftCollection')

  const result = await getDmrktItems<ListingDTO>({
    params: 'orders',
    query,
    cursor,
  })

  if (!result.ok) return result

  return {
    ok: true,
    data: {
      items: result.data.items.map(toListing),
      cursor: result.data.cursor,
    },
  }
}

export function getDmrktSales(limit: number, cursor: string | null = null) {
  const query = new URLSearchParams({
    limit: String(limit),
  })

  query.append('include', 'nftCollection')
  query.append('include', 'order')

  return getDmrktItems<Sale>({
    params: 'settlements',
    query: query,
    cursor,
  })
}

export async function getDmrktItems<T>({
  params,
  query,
  cursor,
}: {
  params: string
  query: URLSearchParams
  cursor: string | null
}): Promise<Result<Page<T>>> {
  if (cursor) {
    query.set('cursor', cursor)
  }

  const url = `${baseUrl}/api/${params}?${query.toString()}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      let error: string

      try {
        const json = await res.json()
        error = json.message ?? JSON.stringify(json)
      } catch {
        error = await res.text()
      }

      return { ok: false, error }
    }

    const data = await res.json()

    return {
      ok: true,
      data: {
        items: data.items as T[],
        cursor: data.nextCursor ?? null,
      },
    }
  } catch (err) {
    return { ok: false, error: `error getting items: ${err}` }
  }
}
