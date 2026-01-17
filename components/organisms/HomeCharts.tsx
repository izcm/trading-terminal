'use client'

import Link from 'next/link'
import 'chart.js/auto'

import { use, useEffect, useMemo, useState } from 'react'

import { formatEther } from 'viem'

import { LineChart, BarChart, DoghnutChart } from '@/components/chartjs'

import { tsMonthNameUTC, formatTsUTC, timeKey } from '@/lib/utils/time'
import { months } from '@/data/constants/months'

import type { Sale } from '@/data/types/sale'
import type { Result } from '@/data/types/core/result'
import type { PaginatedSales } from '@/lib/dmrkt-indexer/actions/sales'
import { aggregateSales } from '@/lib/utils/analytics/sales'
import { weiToChartNumber } from '@/lib/utils/chart'

const mod = (n: number, m: number) => ((n % m) + m) % m

export const HomeCharts = ({ initialData }: { initialData: Promise<Result<PaginatedSales>> }) => {
  const initial = use(initialData)

  if (!initial.ok) {
    return <div className="card">failed to load sales 💀</div>
  }

  const [sales, setSales] = useState<Sale[]>(initial.data.items)
  const [nextCursor, setNextCursor] = useState<string | null>(initial.data.nextCursor)

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

  const bucket = (sales: Sale[], unit: 'day' | 'month' | 'week') => {
    const map = new Map<string, number>()

    for (const sale of sales) {
      const key = timeKey(sale.timestamp, unit)

      map.set(key, (map.get(key) ?? 0) + 1)
    }

    return map
  }

  const analytics = useMemo(() => {
    return aggregateSales(sales, 'week')
  }, [sales])

  const epochLabels = Array.from(analytics.byEpoch.keys())
  const epochData = Array.from(analytics.byEpoch.entries())

  const total = epochData.map(([, v]) => weiToChartNumber(v.volume))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="h-80 w-1/3 card">
          <LineChart labels={epochLabels} data={epochData.map(([, v]) => v.count)} />
        </div>
        <div className="h-80 w-1/3 card">
          <BarChart
            labels={epochLabels}
            data={epochData.map(([, v]) => weiToChartNumber(v.volume))}
          />
        </div>
        <ul className="h-80 w-1/3 card list"></ul>
      </div>

      <div className="flex gap-4 h-150 overflow-y-hidden">
        <ul className="flex-1 card list overflow-y-auto no-scrollbar">
          {sales.map(sale => (
            <li key={sale.txHash} className="border-b border-soft">
              <Link
                href="/collections"
                className="flex justify-between text-muted focus-visible:ring-accent rounded-lg"
              >
                <span>{formatTsUTC(sale.timestamp)}</span>
                <span>{formatEther(BigInt(sale.price))} ETH</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex-1 card list">
          {sales.map(sale => (
            <li key={`c-${sale.orderHash}`}>
              <Link href={`./`} className="focus-visible:ring-accent rounded-lg">
                {sale.txHash}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
