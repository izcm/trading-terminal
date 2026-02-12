'use client'

import Link from 'next/link'
import { Hex } from 'viem'

import 'chart.js/auto'

import { use, useEffect, useMemo, useState } from 'react'
import { LayoutGrid, ChartArea } from 'lucide-react'

import { topNBy } from '@/lib/utils/analytics/topN'
import { aggregateSales, floor } from '@/features/analytics/sales'

import { formatEth2, formatTsUTC, addrDisplay, timeKey, TimeUnit } from '@/lib/utils/format'

import { Sale } from '@/domain/types/sale'
import { Result } from '@/lib/utils/result'
import { PaginatedSales } from '@/lib/dmrkt-indexer/actions/sales'

import { Stat, Modal } from '../../molecules'
import { SalesReceipt } from '../SalesReceipt'
import { HomeCharts } from './HomeCharts'

// LINE: ratio = ASK_volume / (ASK_volume + BID_volume) over time

// LINE: Cumulative volume over time
// always goes up → very line-coded
// shows growth / traction
// investors love this shape
// zero confusion with bars

// stacked bar charts:
// https://www.chartjs.org/docs/latest/samples/bar/stacked.html

type ShowReceiptState = { show: false } | { show: true; sale: Sale }

export const HomeAnalytics = ({
  initialData,
}: {
  initialData: Promise<Result<PaginatedSales>>
}) => {
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
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <section className="flex-2 flex justify-evenly text-stat/70">
            <span>
              sales <strong>{filteredSales.length}</strong>
            </span>

            <span>
              users <strong>{Array.from(analytics.byActor).length}</strong>
            </span>

            <span>
              volume <strong>{formatEth2(totalVolume)}</strong>
            </span>
          </section>
          <div className="flex-1 flex justify-end gap-4">
            <Link className="btn btn-primary" href="/browse">
              <LayoutGrid /> explore dmrkt
            </Link>
            <Link className="btn btn-secondary" href="./">
              <ChartArea /> more analytics
            </Link>
          </div>
        </div>
        <div className="flex gap-4 h-72">
          <div className="basis-2/3 flex gap-4">
            <HomeCharts analytics={analytics} sales={filteredSales} timeUnit={timeUnit} />
          </div>

          <ul className="basis-1/3 card">
            <span className="text-xs text-muted my-2">
              Top Collections · F = floor price · V = volume
            </span>
            {topCollectionsList.map(([k, v], i) => (
              <li
                key={k}
                className="interactive-row p-4 filter-row flex text-muted"
                data-active={filters.collection === k}
                onClick={() => handleFilters('collection', k)}
              >
                <span className="text-sm">#{i + 1}</span>

                <span>SYMBOL</span>

                <Stat
                  value={floor(filteredSales, 'collection', k as `0x${string}`)}
                  label="F"
                  format={formatEth2}
                />

                <Stat value={topCollectionsByKey[k].volume} label="V" format={formatEth2} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4 h-150 overflow-y-hidden">
          <ul className="flex-1 card overflow-y-auto no-scrollbar">
            {filteredSales.map(sale => {
              const { block, tx } = sale.execution
              return (
                <li
                  key={sale.execution.tx.hash}
                  onClick={() => setShowReceipt({ show: true, sale: sale })}
                >
                  <button className="interactive-row p-4 text-muted w-full">
                    <div className="flex gap-4 items-center">
                      <span
                        className={
                          sale.order?.side === 'ASK'
                            ? 'text-pink/80 text-xs'
                            : 'text-green/80 text-xs'
                        }
                      >
                        {sale.order?.side.slice(0, 1)}
                      </span>
                      <span>{formatTsUTC(block.timestamp)}</span>
                    </div>

                    <span>SYMBOL</span>

                    {/* ACTORS */}
                    <Stat value={sale.buyer} label="buyer" format={addrDisplay} />
                    <Stat value={sale.seller} label="seller" format={addrDisplay} />

                    <span>{formatEth2(BigInt(sale.price))} ETH</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {/* TOP ACTORS */}
          <div className="w-2/5 flex flex-col card">
            <span className="text-xs text-muted my-2">
              Top Actors · B = buy volume · S = sell volume
            </span>
            <ul>
              {topActors.map(([k, a], i) => (
                <li
                  key={k}
                  className="interactive-row p-4 filter-row text-muted"
                  data-active={filters.actor === k}
                  onClick={() => handleFilters('actor', k)}
                >
                  <span className="text-sm">#{i + 1}</span>

                  <span className="">{addrDisplay(k as `0x${string}`)}</span>

                  <Stat value={a.buy.volume} label="B" format={formatEth2} />
                  <Stat value={a.sell.volume} label="S" format={formatEth2} />
                </li>
              ))}
            </ul>
          </div>
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
    </>
  )
}
