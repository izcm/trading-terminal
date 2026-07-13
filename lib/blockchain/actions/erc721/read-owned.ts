import { erc721Abi, type Address, type PublicClient } from 'viem'

export async function readOwned(
  client: PublicClient,
  collection: Address,
  user: Address
): Promise<bigint[]> {
  const tokenIds = Array.from({ length: 500 }, (_, i) => BigInt(i))

  const results = await Promise.all(
    tokenIds.map(async tokenId => {
      try {
        const ownerOf = await client.readContract({
          abi: erc721Abi,
          address: collection,
          functionName: 'ownerOf',
          args: [tokenId],
        })
        return ownerOf.toLowerCase() === user.toLowerCase() ? tokenId : null
      } catch {
        return null
      }
    })
  )

  return results.filter((id): id is bigint => id !== null)
}
