import type { Sale } from '@/domain/types'
import { timeKey } from '@/lib/utils/format/time'
import type { TimeUnit } from '@/lib/utils/format/time'
import type { Hex } from 'viem'
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

type SideGroup = 'ASK' | 'BID'

const sideKey: Dimension<SideGroup> = sale => {
  const side = sale.order?.side
  if (!side) return null
  return side === 'ASK' ? 'ASK' : 'BID'
}

const epochKey =
  (unit: TimeUnit): Dimension<string> =>
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

export const aggregateSales = (sales: Sale[], unit: TimeUnit) => {
  const byEpoch = aggregateBy(sales, epochKey(unit))
  const byCollection = aggregateBy(sales, collectionKey)
  const bySide = aggregateBy(sales, sideKey)

  const buys = aggregateBy(sales, buyerKey)
  const sells = aggregateBy(sales, sellerKey)

  return {
    byEpoch,
    byCollection,
    bySide,
    byActor: mergeActors(buys, sells),
  }
}
