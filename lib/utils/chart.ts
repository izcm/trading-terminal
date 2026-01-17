import { formatEther } from 'viem'

export const weiToChartNumber = (wei: bigint): number => {
  return Number(formatEther(wei))
}
