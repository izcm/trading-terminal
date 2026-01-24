import type { Sale } from '@/domain/types'
import { timeKey } from '@/lib/utils/format/time'
import { Hex } from 'viem'

export type Metrics = {
  count: number
  volume: bigint
}

export type ActorMetrics = {
  buy: Metrics
  sell: Metrics
}

const createMetrics = (): Metrics => ({
  count: 0,
  volume: 0n,
})

const applySale = (m: Metrics, sale: Sale) => {
  m.count += 1
  m.volume += BigInt(sale.price)
}

type Dimension<T> = (sale: Sale) => T | null

const epochKey =
  (unit: 'day' | 'week' | 'month'): Dimension<string> =>
  sale =>
    timeKey(sale.execution.block.timestamp, unit)

const collectionKey: Dimension<Hex> = sale => sale.collection
const buyerKey: Dimension<Hex> = sale => sale.buyer
const sellerKey: Dimension<Hex> = sale => sale.seller

const mergeActors = (buys: Map<string, Metrics>, sells: Map<string, Metrics>) => {
  const out = new Map<string, ActorMetrics>()

  for (const [addr, m] of buys) {
    out.set(addr, {
      buy: { ...m },
      sell: { count: 0, volume: 0n },
    })
  }

  for (const [addr, m] of sells) {
    const a = out.get(addr) ?? { buy: { count: 0, volume: 0n }, sell: { count: 0, volume: 0n } }

    a.sell = { ...m }
    out.set(addr, a)
  }

  return out
}

const aggregateBy = <K>(sales: Sale[], dimension: Dimension<K>) => {
  const map = new Map<K, Metrics>()

  for (const sale of sales) {
    const key = dimension(sale)
    if (!key) continue

    const metrics = map.get(key) ?? createMetrics()
    applySale(metrics, sale)
    map.set(key, metrics)
  }

  return map
}

export const aggregateSales = (sales: Sale[], unit: 'day' | 'month' | 'week') => {
  const byEpoch = aggregateBy(sales, epochKey(unit))
  const byCollection = aggregateBy(sales, collectionKey)

  const buys = aggregateBy(sales, buyerKey)
  const sells = aggregateBy(sales, sellerKey)

  return {
    byEpoch,
    byCollection,
    byActor: mergeActors(buys, sells),
  }
}
