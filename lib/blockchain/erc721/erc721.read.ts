import type { Address, Hex } from 'viem'
import { erc721Abi } from 'viem'

import { getPublicClient, readContract } from 'wagmi/actions'
import { config } from '../config/wagmi'

import { mapTokenUriToNFT, type NFT } from '@/domain/nft'
import type { Paginated, Result } from '@/lib/utils/http'

const CHAIN_ID = 31337 // todo: multichain

export async function readNFT(address: Address, tokenId: bigint): Promise<Result<NFT>> {
  const client = getPublicClient(config, { chainId: CHAIN_ID })

  try {
    const tokenUri = await client.readContract({
      address,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [tokenId],
    })

    return {
      ok: true,
      data: mapTokenUriToNFT(CHAIN_ID, address, tokenId, tokenUri),
    }
  } catch (err) {
    return { ok: false, error: `error reading item: ${err}` }
  }
}

// works only with sequential tokenIds (will switch this stuff out with indexing nfts soon)
// only for dev!!
export async function readNFTBatch(
  address: Address,
  limit: number,
  cursor: number = 0 // i know this is absolutely wild (will remove asap)
): Promise<Result<Paginated<NFT>>> {
  const client = getPublicClient(config, { chainId: CHAIN_ID })

  const calls = Array.from({ length: limit }, (_, tokenId) =>
    client.readContract({
      address,
      abi: erc721Abi,
      functionName: 'tokenURI',
      args: [BigInt(tokenId + cursor)],
    })
  )

  try {
    const result = await Promise.all(calls)

    const items = result.map((tokenUri, i) => {
      const tokenId = i + cursor // i know this is absolutely wild (will remove asap)
      return mapTokenUriToNFT(CHAIN_ID, address, BigInt(tokenId), tokenUri)
    })

    return {
      ok: true,
      data: {
        items,
        nextCursor: null, // todo: make this less clumsy
      },
    }
  } catch (err) {
    return { ok: false, error: `error reading items: ${err}` }
  }
}

// temporary (indexer will track nft stats)
async function getTokensByOwner(
  owner: Address,
  collection: Address,
  max = 1000
): Promise<Result<NFT[]>> {
  let client = getPublicClient(config, { chainId: CHAIN_ID })

  const items: NFT[] = []

  for (let tokenId = 0; tokenId < max; tokenId++) {
    const bigTokenId = BigInt(tokenId)

    try {
      const ownerOf = await client.readContract({
        abi: erc721Abi,
        address: collection,
        functionName: 'ownerOf',
        args: [bigTokenId],
      })

      if (ownerOf.toLowerCase() !== owner) continue

      const tokenURI = await client.readContract({
        abi: erc721Abi,
        address: collection,
        functionName: 'tokenURI',
        args: [bigTokenId],
      })

      items.push(mapTokenUriToNFT(CHAIN_ID, collection, bigTokenId, tokenURI))
    } catch {
      // token not minted / any parsing error
      break
    }
  }

  return { ok: true, data: items }
}
