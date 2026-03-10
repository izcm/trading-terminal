import { useMemo } from 'react'

import { weiToChartNumber } from '@/lib/blockchain/utils/bigint'

import type { Sale } from '@/domain/sale'
import type { aggregateSales } from '@/domain/shared/utils/analyze'
import { timeKey, type TimeUnit } from '@/domain/shared/utils/time'

import { BaseChart } from '@/ui/chartjs/BaseChart'
import { createDataset } from '@/ui/chartjs/chartjs-defaults'

import '@/ui/chartjs/chartjs-register'

type AnalyticsChartProps = {
  analytics: ReturnType<typeof aggregateSales>
  sales: Sale[]
  timeUnit: TimeUnit
}

export function Chart({ analytics, sales, timeUnit }: AnalyticsChartProps) {
  const epochKeys = useMemo(() => Array.from(analytics.byEpoch.keys()), [sales])

  const cumulativeVolume = useMemo(() => {
    let sum = 0
    return Array.from(analytics.byEpoch.entries()).map(([, v]) => {
      sum += weiToChartNumber(v.volume)
      return sum
    })
  }, [analytics])

  const volumeByEpoch = (epoch: string, unit: TimeUnit) => {
    const items = sales.filter(sale => timeKey(sale.timestamp, unit) === epoch)

    return items.reduce((sum, sale) => sum + BigInt(sale.price), 0n)
  }

  const volumeBarDatasets = useMemo(() => {
    return [
      createDataset(
        'bar',
        epochKeys.map(epoch => weiToChartNumber(volumeByEpoch(epoch, timeUnit))),
        '#57bddfcb'
      ),
    ]
  }, [epochKeys, sales])

  return (
    // <div className="flex w-full gap-4 h-[250px]">
    //   <div className="basis-1/2 card">
    //     <BaseChart
    //       type={'line'}
    //       labels={epochKeys}
    //       datasets={[createDataset('line', cumulativeVolume)]}
    //     />
    //   </div>
    <>
      <BaseChart type={'bar'} labels={epochKeys} datasets={volumeBarDatasets} />
    </>
    // </div>
  )
}
