import type { Page, Result } from '@/lib/utils/http'

import type { Listing } from '@/domain/listing'
import type { NFT } from '@/domain/nft'

import { toListing, type OrderDTO } from '../types/order'
import { toNFT, type NFTDTO } from '../types/nft'
import { toSearchParams } from './logic/param-mapper'
import { SettlementDTO, toSale } from '../types/settlement'
import { NFTCollectionDTO, toNFTCollection } from '../types/nft-collection'
import { NFTCollection } from '@/domain/nft-collection'

export const baseUrl = process.env.NEXT_PUBLIC_INDEXER_API

function setDefault(q: URLSearchParams, key: string, value: string) {
  if (!q.has(key)) q.set(key, value)
}

function buildQuery({
  filters,
  cursor,
  includes = [],
}: {
  filters: Record<string, string[]>
  cursor?: string | null
  includes?: string[]
}) {
  const query = toSearchParams(filters)

  if (cursor) query.append('cursor', cursor)

  includes.forEach(inc => query.append('include', inc))

  if (!filters.sortField) setDefault(query, 'sortField', 'createdAt')
  if (!filters.sortDir) setDefault(query, 'sortDir', 'desc')

  return query
}

function mapResult<TDTO, T>(res: Result<Page<TDTO>>, toDomain: (dto: TDTO) => T): Result<Page<T>> {
  if (!res.ok) return res

  return {
    ok: true,
    data: {
      items: res.data.items.map(toDomain),
      cursor: res.data.cursor,
    },
  }
}

// --- NFT Collections ---
export async function getDmrktNFTCollections({
  filters = {},
  cursor,
}: {
  filters?: Record<string, string[]>
  cursor?: string | null
} = {}): Promise<Result<Page<NFTCollection>>> {
  const res = await getDmrktItems<NFTCollectionDTO>({
    params: 'nft-collections',
    query: buildQuery({ filters, cursor }),
  })

  return mapResult(res, toNFTCollection)
}

// --- NFTs ---
export async function getDmrktNFTs({
  filters = {},
  cursor,
}: {
  filters?: Record<string, string[]>
  cursor?: string | null
} = {}): Promise<Result<Page<NFT>>> {
  const res = await getDmrktItems<NFTDTO>({
    params: 'nfts',
    query: buildQuery({ filters, cursor }),
  })

  return mapResult(res, toNFT)
}

// --- Listings ---
export async function getDmrktListings({
  filters = {},
  cursor,
}: {
  filters?: Record<string, string[]>
  cursor?: string | null
} = {}): Promise<Result<Page<Listing>>> {
  const query = buildQuery({ filters, cursor, includes: ['nftCollection'] })
  query.append('isCollectionBid', 'false') // added since collectionBid feature is paused

  const res = await getDmrktItems<OrderDTO>({
    params: 'orders',
    query,
  })
  return mapResult(res, toListing)
}

// --- Sales ---
export async function getDmrktSales({
  filters = {},
  cursor,
}: {
  filters?: Record<string, string[]>
  cursor?: string | null
} = {}) {
  const query = buildQuery({ filters, cursor, includes: ['nftCollection', 'order'] })
  const res = await getDmrktItems<SettlementDTO>({
    params: 'settlements',
    query,
  })
  return mapResult(res, toSale)
}

// --- Core fetch ---
export async function getDmrktItems<T>({
  params,
  query,
}: {
  params: string
  query: URLSearchParams
}): Promise<Result<Page<T>>> {
  const url = `${baseUrl}/api/${params}?${query.toString()}&limit=25`

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
