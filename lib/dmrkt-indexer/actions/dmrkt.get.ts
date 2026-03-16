import type { Page, Result } from '@/lib/utils/http'

import type { ListingDTO } from '../types/listing-dto'
import { toListing } from '../types/listing-dto'
import type { Listing } from '@/domain/listing'
import type { NFTCollection } from '@/domain/nft-collection'
import { toNFTCollection, type NFTCollectionDTO } from '../types/nft-collection'

import type { Sale } from '@/domain/sale'

export const baseUrl = process.env.NEXT_PUBLIC_INDEXER_ENDPOINT_URL

export async function getDmrktCollections(
  limit: number,
  cursor: string | null = null
): Promise<Result<Page<NFTCollection>>> {
  const result = await getDmrktItems<NFTCollectionDTO>({
    params: 'nft-collections',
    query: `limit=${limit}&address=0x0Cc60CAE6Db663824eb49AfD43a9871E6e8ed885`,
    cursor,
  })

  if (!result.ok) return result

  return {
    ok: true,
    data: {
      items: result.data.items.map(toNFTCollection),
      cursor: result.data.cursor,
    },
  }
}

export async function getDmrktListings(
  limit: number = 10,
  cursor: string | null = null
): Promise<Result<Page<Listing>>> {
  const result = await getDmrktItems<ListingDTO>({
    params: 'orders',
    query: `limit=${limit}&status=active&include=nftCollection`,
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
  return getDmrktItems<Sale>({
    params: 'settlements',
    query: `limit=${limit}&include=nftCollection&include=order`,
    cursor,
  })
}

export async function getDmrktItems<T>({
  params,
  query,
  cursor,
}: {
  params: string
  query: string
  cursor: string | null
}): Promise<Result<Page<T>>> {
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
        cursor: data.nextCursor ?? null,
      },
    }
  } catch (err) {
    return { ok: false, error: `error getting items: ${err}` }
  }
}
