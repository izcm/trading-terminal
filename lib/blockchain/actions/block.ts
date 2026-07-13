import { PublicClient } from 'viem'

export async function getBlockTimestamp(client: PublicClient): Promise<number> {
  const block = await client.getBlock()
  return Number(block.timestamp)
}
