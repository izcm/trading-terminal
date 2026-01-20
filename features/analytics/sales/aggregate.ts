import type { Sale } from '@/domain/types'
import { timeKey } from '@/lib/utils/format/time'

export type SalesAnalytics = {
  count: number
  volume: bigint
}

export type ActorAnalytics = {
  buy: SalesAnalytics
  sell: SalesAnalytics
}

export const aggregateSales = (sales: Sale[], unit: 'day' | 'month' | 'week') => {
  const byEpoch = new Map<string, SalesAnalytics>()
  const byCollection = new Map<string, SalesAnalytics>()
  const byActor = new Map<string, ActorAnalytics>()

  for (const sale of sales) {
    const tKey = timeKey(sale.timestamp, unit)
    const cKey = sale.collection
    const aKeys = { buyer: sale.buyer, seller: sale.seller }

    const epoch = byEpoch.get(tKey) ?? { count: 0, volume: 0n }
    epoch.count += 1
    epoch.volume += BigInt(sale.price) // TODO: if any other currency than weth is whitelisted => bugs
    byEpoch.set(tKey, epoch)

    const col = byCollection.get(cKey) ?? { count: 0, volume: 0n }
    col.count += 1
    col.volume += BigInt(sale.price)
    byCollection.set(cKey, col)

    const bActor = byActor.get(aKeys.buyer) ?? {
      buy: { count: 0, volume: 0n },
      sell: { count: 0, volume: 0n },
    }
    bActor.buy.count += 1
    bActor.buy.volume += BigInt(sale.price)
    byActor.set(aKeys.buyer, bActor)

    const sActor = byActor.get(aKeys.seller) ?? {
      buy: { count: 0, volume: 0n },
      sell: { count: 0, volume: 0n },
    }
    sActor.sell.count += 1
    sActor.sell.volume += BigInt(sale.price)
    byActor.set(aKeys.seller, sActor)
  }

  return {
    byEpoch,
    byCollection,
    byActor,
  }
}
