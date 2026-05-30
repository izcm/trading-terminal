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

export function getDmrktListing(
  chainId: number,
  orderHash: string,
  signal?: AbortSignal
): Promise<Result<Listing>> {
  return getDmrktItem('orders', `${chainId}:${orderHash}`, signal)
}

export function getDmrktSale(
  chainId: number,
  orderHash: string,
  signal?: AbortSignal
): Promise<Result<Sale>> {
  return getDmrktItem('settlements', `${chainId}:${orderHash}`, signal)
}

export function getDmrktNFT(
  chainId: number,
  collection: string,
  tokenId: string | bigint,
  signal?: AbortSignal
): Promise<Result<NFT>> {
  return getDmrktItem('nfts', `${chainId}:${collection}:${tokenId}`, signal)
}

export async function getDmrktNFTCollection(
  chainId: number,
  collection: string,
  signal?: AbortSignal
): Promise<Result<NFTCollection>> {
  const res = await getDmrktItem<NFTCollectionDTO>(
    'nft-collections',
    `${chainId}:${collection}`,
    signal
  )
  return mapItem(res, toNFTCollection)
}

export async function getDmrktItem<T>(
  params: string,
  id: string,
  signal?: AbortSignal
): Promise<Result<T>> {
  const url = `${getBaseUrl()}/api/${params}/${id}`

  try {
    const res = await fetch(url, { signal })

    if (!res.ok) {
      const error = await getResponseError(res)
      return { ok: false, error }
    }

    const data = await res.json()
    return { ok: true, data: data as T }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError')
      return { ok: false, error: 'Fetch aborted' }
    return { ok: false, error: `Network Error: ${err}` }
  }
}
