import type { Sale } from '@/data/types'
import { timeKey } from '../time'

export type SalesAnalytics = {
  count: number
  volume: bigint
}

export const aggregateSales = (sales: Sale[], unit: 'day' | 'month' | 'week') => {
  const byEpoch = new Map<string, SalesAnalytics>()
  const byCollection = new Map<string, SalesAnalytics>()

  for (const sale of sales) {
    const tKey = timeKey(sale.timestamp, unit)
    const cKey = sale.collection

    const epoch = byEpoch.get(tKey) ?? { count: 0, volume: 0n }
    epoch.count += 1
    epoch.volume += BigInt(sale.price) // TODO: if any other currency than weth is whitelisted => bugs
    byEpoch.set(tKey, epoch)

    const col = byCollection.get(cKey) ?? { count: 0, volume: 0n }
    col.count += 1
    col.volume += BigInt(sale.price)
    byCollection.set(cKey, col)
  }

  return {
    byEpoch,
    byCollection,
  }
}
