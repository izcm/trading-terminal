'use client'

import Link from 'next/link'
import 'chart.js/auto'

import { use, useEffect, useMemo, useState } from 'react'

import { getCollection } from '@/dev/collections'

import { BaseChart } from '@/components/chartjs/BaseChart'
import { createDataset } from '../chartjs/ChartProps'

import { aggregateSales, floor, topNBy } from '@/lib/utils/analytics/sales'

import { formatTsUTC } from '@/lib/utils/format/time'
import { formatEth2, weiToChartNumber } from '@/lib/utils/format/bigint'

import type { Sale } from '@/data/types/sale'
import type { Result } from '@/data/types/core/result'
import type { PaginatedSales } from '@/lib/dmrkt-indexer/actions/sales'
import { addrDisplay } from '@/lib/utils/format/address'
import { Stat } from '../molecules/Stat'

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

  return (
    <div className="flex flex-col gap-4">
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
              className={`interactive-row filter-row flex items-center gap-3 text-muted`}
              data-active={filters.collection === k}
              onClick={() => handleFilters('collection', k)}
            >
              <span className="text-sm">#{i + 1}</span>

              <span>{topCollectionsMeta[k].symbol}</span>

              <Stat
                value={floor(sales, 'collection', k as `0x${string}`)}
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
          {sales.map(sale => (
            <li key={sale.txHash} className="interactive-row">
              <Link
                href="/collections"
                className="flex justify-between w-full text-muted rounded-lg"
              >
                <span>{formatTsUTC(sale.timestamp)}</span>

                <span>{topCollectionsMeta[sale.collection].symbol}</span>

                {/* ACTORS */}
                <Stat value={sale.buyer} label="buyer" format={addrDisplay} />
                <Stat value={sale.seller} label="seller" format={addrDisplay} />

                <span>{formatEth2(BigInt(sale.price))} ETH</span>
              </Link>
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
                className="interactive-row filter-row flex justify-evenly text-muted"
                data-active={filters.collection === k}
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
  )
}
