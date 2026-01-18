'use client'

import Link from 'next/link'
import 'chart.js/auto'

import { use, useEffect, useMemo, useState } from 'react'
import { formatEther } from 'viem'

import { BaseChart } from '@/components/chartjs/BaseChart'
import { createDataset } from '../chartjs/ChartProps'

import { formatTsUTC } from '@/lib/utils/time'

import { aggregateSales, topNBy } from '@/lib/utils/analytics/sales'
import { weiToChartNumber } from '@/lib/utils/chart'

import type { Sale } from '@/data/types/sale'
import type { Result } from '@/data/types/core/result'
import type { PaginatedSales } from '@/lib/dmrkt-indexer/actions/sales'

import { getCollection } from '@/dev/collections'

export const HomeCharts = ({ initialData }: { initialData: Promise<Result<PaginatedSales>> }) => {
  const initial = use(initialData)

  if (!initial.ok) {
    return <div className="card">failed to load sales 💀</div>
  }

  const [sales, setSales] = useState<Sale[]>(initial.data.items)
  const [nextCursor, setNextCursor] = useState<string | null>(initial.data.nextCursor)
  const [filters, setFilters] = useState<{
    collection: `0x${string}` | null
    epoch: string | null
  }>({
    collection: null,
    epoch: null,
  })

  const handleFilters = (filter: 'collection', value: any) => {
    if (filters[filter] === value) value = null

    setFilters(prev => ({
      ...prev,
      [filter]: value,
    }))
  }

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
    return aggregateSales(sales, 'week')
  }, [sales])

  const epochLabels = Array.from(analytics.byEpoch.keys())
  const epochData = Array.from(analytics.byEpoch.entries())

  const topCollectionsList = topNBy(analytics.byCollection, 'volume', 3)
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 h-80">
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
          {topCollectionsList.map(([k, v], i) => (
            <li
              key={k}
              className="interactive-row filter-row flex items-center gap-3 text-muted"
              data-active={filters.collection === k}
              onClick={() => handleFilters('collection', k)}
            >
              {/* rank */}
              <span className="text-sm">#{i + 1}</span>

              {/* symbol */}
              <span>{topCollectionsMeta[k].symbol}</span>

              <span className="text-sm">floor ---</span>
              <span className="text-sm">{formatEther(topCollectionsByKey[k].volume)} ETH</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 h-150 overflow-y-hidden">
        <ul className="flex-1 card overflow-y-auto no-scrollbar">
          {sales.map(sale => (
            <li key={sale.txHash} className="interactive-row">
              <Link
                href="/collections"
                className="flex justify-between w-full text-muted focus-visible:ring-accent rounded-lg"
              >
                <span>{formatTsUTC(sale.timestamp)}</span>
                <span>{formatEther(BigInt(sale.price))} ETH</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* TOP ACTORS */}
        <div className="w-2/5 flex flex-col card">
          <span className="text-xs text-muted my-2">B = buy volume · S = sell volume</span>
          <ul>
            {topCollectionsList.map(([k, v], i) => (
              <li
                key={k}
                className="interactive-row filter-row flex items-center gap-3 text-muted"
                data-active={filters.collection === k}
              >
                <span className="w-6 text-sm">#{i + 1}</span>

                {/* address */}
                <div className="flex-1 truncate font-medium">0x123abc</div>

                <span className="flex items-center gap-1 text-sm text-muted">
                  <span className="text-xs opacity-60">B</span>
                  {formatEther(v.volume)}
                </span>

                <span className="flex items-center gap-1 text-sm text-muted">
                  <span className="text-xs opacity-60">S</span>
                  {formatEther(v.volume)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
