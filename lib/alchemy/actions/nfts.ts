import { AlchemyNFT } from '@/lib/alchemy/types/nft'
import { ALCHEMY_API_KEY as apiKey } from '../constants'
import { ALCHEMY_BASE_URL as endpoint } from '../constants'

export const getNFTByContract = async (
  contract: `0x${string}`
): Promise<{ base: any; metas: AlchemyNFT[] }> => {
  const baseUrl = `${endpoint}/nft/v3/${apiKey}`

  const res = await fetch(`${baseUrl}/getNFTsForContract?contractAddress=${contract}`)
  const data = await res.json()

  // fetch metadata for each
  const metas = await Promise.all(
    data.nfts.map(async (nft: any) => {
      const tokenId = nft.tokenId
      const res = await fetch(
        `${baseUrl}/getNFTMetadata?contractAddress=${contract}&tokenId=${tokenId}`
      )
      return res.json()
    })
  )

  return {
    base: data,
    metas,
  }
}
