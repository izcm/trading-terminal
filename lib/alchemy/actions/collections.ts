import { AlchemyCollection } from '../types/collection'
import { AttributeSummary } from '@/data/types'

import { Result } from '@/data/types/core/result'

import { ALCHEMY_API_KEY as apiKey } from '../constants'
import { ALCHEMY_BASE_URL as baseUrl } from '../constants'

export const getCollectionMetadata = async (
  address: `0x${string}`
): Promise<Result<AlchemyCollection>> => {
  const url = `${baseUrl}/nft/v3/${apiKey}/getContractMetadata?contractAddress=${address}`

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
  const url = `${baseUrl}/nft/v3/${apiKey}/summarizeNFTAttributes`

  const res = await fetch(`${url}?contractAddress=${address}`)
  const data = await res.json()

  return data.summary
}
