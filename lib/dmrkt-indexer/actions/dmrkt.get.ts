import type { Paginated, Result } from '@/lib/utils/http'

import type { Listing } from '../types/listing'
import type { NFTCollection } from '../types/nft-collection'

import type { Sale } from '@/domain/sale'

export const baseUrl = process.env.NEXT_PUBLIC_INDEXER_ENDPOINT_URL

export async function getDmrktCollections(limit: number, cursor: string | null = null) {
  return getDmrktItems<NFTCollection>(
    'nft-collections',
    `limit=${limit}&address=0x0Cc60CAE6Db663824eb49AfD43a9871E6e8ed885`,
    cursor
  )
}

export async function getDmrktTopCollections(limit: number) {
  return getDmrktItems<NFTCollection>('nft-collections/top', `limit=${limit}`, null)
}

export async function getDmrktListings(limit: number = 10, cursor: string | null = null) {
  return getDmrktItems<Listing>(
    'orders',
    `limit=${limit}&status=active&include=nftCollection`,
    cursor
  )
}

export async function getDmrktSales(limit: number, cursor: string | null = null) {
  return getDmrktItems<Sale>(
    'settlements',
    `limit=${limit}&include=nftCollection&include=order`,
    cursor
  )
}

export async function getDmrktItem<T>() {}
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
        items: data.items as T[],
        nextCursor: data.nextCursor ?? null,
      },
    }
  } catch (err) {
    return { ok: false, error: `error getting items: ${err}` }
  }
}
