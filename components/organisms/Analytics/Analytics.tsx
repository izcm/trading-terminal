'use client'

import Link from 'next/link'
import { Hex } from 'viem'

import 'chart.js/auto'

import { use, useEffect, useMemo, useState } from 'react'
import { LayoutGrid, ChartArea } from 'lucide-react'

import { topNBy } from '@/lib/utils/analytics/topN'
import { aggregateSales, floor } from '@/features/analytics/sales'

import { formatEth2, formatTsUTC, shortAddr, timeKey, TimeUnit } from '@/lib/utils/format'

import { Sale } from '@/domain/types/sale'
import { Result } from '@/lib/utils/http'
import { PaginatedSales } from '@/lib/dmrkt-indexer/actions/sales.get'

import { Stat, Modal } from '../../molecules'
import { SalesReceipt } from '../SalesReceipt'
import { HomeCharts } from './Charts'

// LINE: ratio = ASK_volume / (ASK_volume + BID_volume) over time

// LINE: Cumulative volume over time
// always goes up → very line-coded
// shows growth / traction
// investors love this shape
// zero confusion with bars

// stacked bar charts:
// https://www.chartjs.org/docs/latest/samples/bar/stacked.html

type ShowReceiptState = { show: false } | { show: true; sale: Sale }

export function SalesAnalytics({ initialData }: { initialData: Promise<Result<PaginatedSales>> }) {
  const initial = use(initialData)

  if (!initial.ok) {
    return <div className="card">failed to load sales 💀</div>
  }

  const [sales, setSales] = useState<Sale[]>(initial.data.items)
  const [nextCursor, setNextCursor] = useState<string | null>(initial.data.nextCursor)
  const [filters, setFilters] = useState<{
    collection: Hex | null
    actor: Hex | null
    epoch: string | null
  }>({
    collection: null,
    actor: null,
    epoch: null,
  })

  // add timeUnit variable
  const timeUnit: TimeUnit = 'week'

  // tx onclick opens receipt-modal
  const [showReceipt, setShowReceipt] = useState<ShowReceiptState>({ show: false })

  useEffect(() => {
    if (!nextCursor) return

    const fetchMore = async () => {
      const res = await fetch(`/api/sales?limit=100&cursor=${nextCursor}`)

      const page: Result<PaginatedSales> = await res.json()

      if (page.ok) {
        setSales(prev => [...prev, ...page.data.items])
        setNextCursor(page.data.nextCursor)
      }
    }

    fetchMore()
  }, [nextCursor])

  const handleFilters = (filter: keyof typeof filters, value: any) => {
    if (filters[filter] === value) value = null

    setFilters(prev => ({
      ...prev,
      [filter]: value,
    }))
  }

  const applyFilters = (sales: Sale[], f: typeof filters) => {
    return sales.filter(sale => {
      if (f.collection && sale.collection !== f.collection) {
        return false
      }

      if (f.actor && sale.buyer !== f.actor && sale.seller !== f.actor) {
        return false
      }

      return true
    })
  }

  const filteredSales = useMemo(() => {
    return applyFilters(sales, filters)
  }, [filters, sales])

  const analytics = useMemo(() => {
    return aggregateSales(filteredSales, timeUnit)
  }, [filteredSales, timeUnit])

  const topCollectionsList = topNBy(analytics.byCollection, a => a.volume, 3)
  const topCollectionsByKey = useMemo(
    () => Object.fromEntries(topCollectionsList),
    [topCollectionsList]
  )

  const topActors = topNBy(analytics.byActor, a => a.buy.volume + a.sell.volume, 10)

  const totalVolume = filteredSales.reduce((sum, sale) => sum + BigInt(sale.price), 0n)

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-evenly">
        <span>
          sales <strong>{filteredSales.length}</strong>
        </span>

        <span>
          users <strong>{Array.from(analytics.byActor).length}</strong>
        </span>

        <span>
          volume <strong>{formatEth2(totalVolume)}</strong>
        </span>
      </div>
      <div className="flex gap-4 h-140">
        <HomeCharts analytics={analytics} sales={filteredSales} timeUnit={timeUnit} />

        <ul className="basis-1/3 card">
          <span className="text-xs text-muted my-2">
            Top Collections · F = floor price · V = volume
          </span>
          {topCollectionsList.map(([k, v], i) => (
            <li
              key={k}
              className="stat-row filter-row flex text-muted"
              data-active={filters.collection === k}
              onClick={() => handleFilters('collection', k)}
            >
              <span className="text-sm">#{i + 1}</span>

              <span>SYMBOL</span>

              <Stat
                value={floor(filteredSales, 'collection', k as `0x${string}`)}
                label="F"
                fmtFn={formatEth2}
              />

              <Stat value={topCollectionsByKey[k].volume} label="V" fmtFn={formatEth2} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 overflow-hidden">
        <ul className="flex-1 card overflow-y-auto no-scrollbar">
          {filteredSales.map(sale => {
            const { block, tx } = sale.execution
            return (
              <li
                key={sale.execution.tx.hash}
                onClick={() => setShowReceipt({ show: true, sale: sale })}
              >
                <button className="stat-row text-muted w-full">
                  <div className="flex gap-4 items-center">
                    <span
                      className={
                        sale.order?.side === 'ASK' ? 'text-ask/70 text-xs' : 'text-bid/70 text-xs'
                      }
                    >
                      {sale.order?.side.slice(0, 1)}
                    </span>
                    <span>{formatTsUTC(block.timestamp)}</span>
                  </div>

                  <span>SYMBOL</span>

                  <Stat value={sale.buyer} label="buyer" fmtFn={shortAddr} />
                  <Stat value={sale.seller} label="seller" fmtFn={shortAddr} />

                  <span>{formatEth2(BigInt(sale.price))} ETH</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="w-1/3 flex flex-col card">
          <span className="text-xs text-muted my-2">
            Top Actors · B = buy volume · S = sell volume
          </span>
          <ul>
            {topActors.map(([k, a], i) => (
              <li
                key={k}
                className="stat-row filter-row text-muted"
                data-active={filters.actor === k}
                onClick={() => handleFilters('actor', k)}
              >
                <span className="text-sm">#{i + 1}</span>

                <span>{shortAddr(k as `0x${string}`)}</span>

                <Stat value={a.buy.volume} label="B" fmtFn={formatEth2} />
                <Stat value={a.sell.volume} label="S" fmtFn={formatEth2} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showReceipt.show && (
        <Modal isOpen={showReceipt.show} onClose={() => setShowReceipt({ show: false })}>
          <div className="p-4 flex flex-col gap-4">
            <SalesReceipt sale={showReceipt.sale} />
            <div className="border-t border-default mt-4" />
            <button className="btn btn-secondary" onClick={() => setShowReceipt({ show: false })}>
              close
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
