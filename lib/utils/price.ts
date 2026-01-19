import { formatEther } from 'viem'

export const weiToChartNumber = (wei: bigint): number => {
  return Number(formatEther(wei))
}

export const formatEth2 = (wei: bigint) => {
  const eth = Number(formatEther(wei))
  return eth.toFixed(2)
}
