import type { Page, Result } from '@/lib/utils/http'

import type { Sale } from '@/domain/sale'
import type { Listing } from '@/domain/listing'

import { toListing, type ListingDTO } from '../types/listing-dto'
import { NFT } from '../types/nft'

export const baseUrl = process.env.NEXT_PUBLIC_INDEXER_ENDPOINT_URL

export async function getDmrktNFTs(
  filters: Record<string, string> = {}
): Promise<Result<Page<NFT>>> {
  const query = new URLSearchParams(filters)

  return getDmrktItems<NFT>({
    params: 'nfts',
    query,
  })
}

export async function getDmrktListings(
  filters: Record<string, string> = {}
): Promise<Result<Page<Listing>>> {
  const query = new URLSearchParams(filters)

  query.append('include', 'nftCollection')

  const res = await getDmrktItems<ListingDTO>({
    params: 'orders',
    query,
  })

  if (!res.ok) return res

  return {
    ok: true,
    data: {
      items: res.data.items.map(toListing),
      cursor: res.data.cursor,
    },
  }
}

export function getDmrktSales(filters: Record<string, string> = {}) {
  const query = new URLSearchParams(filters)

  query.append('include', 'nftCollection')
  query.append('include', 'order')

  return getDmrktItems<Sale>({
    params: 'settlements',
    query,
  })
}

export async function getDmrktItems<T>({
  params,
  query,
}: {
  params: string
  query: URLSearchParams
}): Promise<Result<Page<T>>> {
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
