import type { Page, Result } from '@/lib/utils/http'

import type { Listing } from '@/domain/listing'
import type { NFT } from '@/domain/nft'
import type { NFTCollection } from '@/domain/nft-collection'

import { toListing, type OrderDTO } from '../dtos/order'
import { toNFT, type NFTDTO } from '../dtos/nft'
import { NFTCollectionDTO, toNFTCollection } from '../dtos/nft-collection'
import { SettlementDTO, toSale } from '../dtos/settlement'

import { getBaseUrl } from '../config'
import { buildQuery } from './logic/build-query'
import { getResponseError } from './logic/get-error'

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
  const url = `${getBaseUrl()}/api/${params}?${query.toString()}&limit=25`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      const error = await getResponseError(res)

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
    return { ok: false, error: `Network Error: ${err}` }
  }
}
