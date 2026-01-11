import { AlchemyCollection } from '../types/collection'
import { AttributeSummary } from '@/types'

import { ALCHEMY_API_KEY as apiKey } from '../constants'
import { ALCHEMY_ENDPOINT_URL as endpoint } from '../constants'

export const getCollectionMetadata = async (
  address: `0x${string}`
): Promise<Result<AlchemyCollection>> => {
  const url = `${endpoint}/nft/v3/${apiKey}/getContractMetadata?contractAddress=${address}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    return { ok: true, data }
  } catch (err) {
    return { ok: false, error: `Alchemy failed: ${err}` }
  }
}

export const getCollectionAttributes = async (
  address: `0x${string}`
): Promise<AttributeSummary> => {
  const url = `${endpoint}/nft/v3/${apiKey}/summarizeNFTAttributes`

  const res = await fetch(`${url}?contractAddress=${address}`)
  const data = await res.json()

  return data.summary
}

export type Result<T> = { ok: true; data: T } | { ok: false; error: string }
