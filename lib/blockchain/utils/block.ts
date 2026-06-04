import { getPublicClient } from 'wagmi/actions'
import { wagmiConfig } from '../wagmi'

type ChainId = (typeof wagmiConfig.chains)[number]['id']

export async function getBlockTimestamp(chainId: ChainId): Promise<number> {
  const client = getPublicClient(wagmiConfig, { chainId })
  const block = await client.getBlock()
  return Number(block.timestamp)
}
