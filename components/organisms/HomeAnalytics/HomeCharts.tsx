import { useMemo } from 'react'

import { Sale } from '@/domain/types'

import { aggregateSales } from '@/features/analytics/sales'
import { timeKey, TimeUnit, weiToChartNumber } from '@/lib/utils/format'

import { createDataset } from '@/components/chartjs/props'
import { BaseChart } from '@/components/chartjs/BaseChart'

type AnalyticsChartProps = {
  analytics: ReturnType<typeof aggregateSales>
  sales: Sale[]
  timeUnit: TimeUnit
}

export const HomeCharts = ({ analytics, sales, timeUnit }: AnalyticsChartProps) => {
  const epochKeys = useMemo(() => Array.from(analytics.byEpoch.keys()), [sales])

  const cumulativeVolume = useMemo(() => {
    let sum = 0
    return Array.from(analytics.byEpoch.entries()).map(([, v]) => {
      sum += weiToChartNumber(v.volume)
      return sum
    })
  }, [analytics])

  const sideByEpoch = (side: 'ASK' | 'BID', epoch: string, unit: TimeUnit) => {
    const items = sales.filter(
      sale =>
        timeKey(sale.execution.block.timestamp, unit) === epoch &&
        sale.order &&
        sale.order?.side === side
    )

    return items.reduce((sum, sale) => sum + BigInt(sale.price), 0n)
  }

  const volumeBarDatasets = useMemo(() => {
    return [
      createDataset(
        'bar',
        epochKeys.map(epoch => weiToChartNumber(sideByEpoch('ASK', epoch, timeUnit))),
        '#e37dec9d'
      ),
      createDataset(
        'bar',
        epochKeys.map(epoch => weiToChartNumber(sideByEpoch('BID', epoch, timeUnit))),
        '#57bddfcb'
      ),
    ]
  }, [epochKeys, sales])

  return (
    <>
      <div className="basis-1/2 card">
        <BaseChart
          type={'line'}
          labels={epochKeys}
          datasets={[createDataset('line', cumulativeVolume)]}
        />
      </div>
      <div className="basis-1/2 card">
        <BaseChart type={'bar'} labels={epochKeys} datasets={volumeBarDatasets} />
      </div>
    </>
  )
}
