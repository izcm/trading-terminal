import type { Result } from '@/lib/utils/http'

import type { Listing } from '@/domain/listing'
import type { Sale } from '@/domain/sale'
import type { NFT } from '@/domain/nft'
import type { NFTCollection } from '@/domain/nft-collection'

import { NFTCollectionDTO, toNFTCollection } from '../dtos/nft-collection'
import { getBaseUrl } from '../config'
import { getResponseError } from './logic/get-error'

function mapItem<TDTO, T>(res: Result<TDTO>, toDomain: (dto: TDTO) => T): Result<T> {
  if (!res.ok) return res
  return { ok: true, data: toDomain(res.data) }
}

export function getDmrktListing(id: string): Promise<Result<Listing>> {
  return getDmrktItem('orders', id)
}

export function getDmrktSale(id: string): Promise<Result<Sale>> {
  return getDmrktItem('settlements', id)
}

export function getDmrktNFT(id: string): Promise<Result<NFT>> {
  return getDmrktItem('nfts', id)
}

export async function getDmrktNFTCollection(
  chainId: number,
  collection: string
): Promise<Result<NFTCollection>> {
  const res = await getDmrktItem<NFTCollectionDTO>('nft-collections', `${chainId}:${collection}`)
  return mapItem(res, toNFTCollection)
}

export async function getDmrktItem<T>(params: string, id: string): Promise<Result<T>> {
  const url = `${getBaseUrl()}/api/${params}/${id}`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      const error = await getResponseError(res)
      return { ok: false, error }
    }

    const data = await res.json()
    return { ok: true, data: data as T }
  } catch (err) {
    return { ok: false, error: `Network Error: ${err}` }
  }
}
