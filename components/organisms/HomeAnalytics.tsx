'use client'

import Link from 'next/link'
import 'chart.js/auto'

import { use, useEffect, useMemo, useState } from 'react'
import { LayoutGrid, ChartArea, Receipt } from 'lucide-react'

import { getCollection } from '@/dev/collections'

import { topNBy } from '@/lib/utils/analytics/topN'
import { aggregateSales, floor } from '@/features/analytics/sales'

import { formatEth2, weiToChartNumber, formatTsUTC, addrDisplay } from '@/lib/utils/format'
import type { Hex } from 'viem'

import { Sale } from '@/domain/types/sale'
import { Result } from '@/lib/utils/result'
import { PaginatedSales } from '@/lib/dmrkt-indexer/actions/sales'

import { Stat, Modal } from '../molecules'
import { BaseChart } from '../chartjs/BaseChart'
import { createDataset } from '../chartjs/ChartProps'

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

  // tx onclick opens receipt-modal
  const [showReceipt, setShowReceipt] = useState<{ show: boolean; tx: Hex | null }>()

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

  useEffect(() => {
    if (!nextCursor) return

    const fetchMore = async () => {
      const res = await fetch(`/api/sales?limit=10&cursor=${nextCursor}`)

      const page: Result<PaginatedSales> = await res.json()

      if (page.ok) {
        setSales(prev => [...prev, ...page.data.items])
        setNextCursor(page.data.nextCursor)
      }
    }

    fetchMore()
  }, [nextCursor])

  const analytics = useMemo(() => {
    return aggregateSales(filteredSales, 'week')
  }, [filteredSales])

  const epochLabels = Array.from(analytics.byEpoch.keys())
  const epochData = Array.from(analytics.byEpoch.entries())

  const topCollectionsList = topNBy(analytics.byCollection, a => a.volume, 3)
  const topCollectionsByKey = useMemo(
    () => Object.fromEntries(topCollectionsList),
    [topCollectionsList]
  )

  const topCollectionsMeta: Record<string, { name: string; symbol: string }> = Object.fromEntries(
    topCollectionsList.map(([k]) => {
      const meta = getCollection(k as `0x${string}`) // tmp will do rpc call + useeffect
      return [k, { name: meta!.name, symbol: meta!.symbol }] // tmp... will fix error handling
    })
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
            <Link className="btn btn-primary" href="/collections">
              <LayoutGrid /> explore dmrkt
            </Link>
            <Link className="btn btn-secondary" href="./">
              <ChartArea /> more analytics
            </Link>
          </div>
        </div>
        <div className="flex gap-4 h-72">
          <div className="basis-2/3 flex gap-4">
            <div className="w-1/2 card">
              <BaseChart
                type={'line'}
                labels={epochLabels}
                datasets={[
                  createDataset(
                    'line',
                    epochData.map(([, v]) => v.count)
                  ),
                ]}
              />
            </div>
            <div className="w-1/2 card">
              <BaseChart
                type={'bar'}
                labels={epochLabels}
                datasets={[
                  createDataset(
                    'bar',
                    epochData.map(([, v]) => weiToChartNumber(v.volume))
                  ),
                ]}
              />
            </div>
          </div>

          <ul className="basis-1/3 card">
            <span className="text-xs text-muted my-2">
              Top Collections · F = floor price · V = volume
            </span>
            {topCollectionsList.map(([k, v], i) => (
              <li
                key={k}
                className="interactive-row filter-row flex text-muted"
                data-active={filters.collection === k}
                onClick={() => handleFilters('collection', k)}
              >
                <span className="text-sm">#{i + 1}</span>

                <span>{topCollectionsMeta[k].symbol}</span>

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
            {filteredSales.map(sale => (
              <li
                key={sale.txHash}
                className="interactive-row text-muted"
                onClick={() => setShowReceipt({ show: true, tx: sale.txHash })}
              >
                <span>{formatTsUTC(sale.timestamp)}</span>

                <span>{topCollectionsMeta[sale.collection].symbol}</span>

                {/* ACTORS */}
                <Stat value={sale.buyer} label="buyer" format={addrDisplay} />
                <Stat value={sale.seller} label="seller" format={addrDisplay} />

                <span>{formatEth2(BigInt(sale.price))} ETH</span>
              </li>
            ))}
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
                  className="interactive-row filter-row text-muted"
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
      {showReceipt && (
        <div className="fixed z-[999]">
          <Modal
            isOpen={showReceipt.show}
            onClose={() => setShowReceipt({ show: false, tx: null })}
          >
            {showReceipt.tx}
          </Modal>
        </div>
      )}
    </>
  )
}
