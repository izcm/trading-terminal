import { Result } from '@/lib/utils/http'

import { Listing } from '@/domain/listing'
import { Sale } from '@/domain/sale'
import { NFT } from '@/domain/nft'

import { getBaseUrl } from '../config'

export function getDmrktListing(id: string): Promise<Result<Listing>> {
  return getDmrktItem('orders', id)
}

export function getDmrktSale(id: string): Promise<Result<Sale>> {
  return getDmrktItem('settlements', id)
}

export function getDmrktNFT(id: string): Promise<Result<NFT>> {
  return getDmrktItem('nfts', id)
}

export async function getDmrktItem<T>(params: string, id: string): Promise<Result<T>> {
  const url = `${getBaseUrl()}/api/${params}/${id}`

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
    return { ok: false, error: `Network Error: ${err}` }
  }
}
