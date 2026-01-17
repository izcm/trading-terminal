'use client'

import { Doughnut } from 'react-chartjs-2'

import type { CoreChartProps } from '../ChartProps'
import { defaultOptions as options, doghnutDataset } from '../ChartProps'

export const DoghnutChart = ({ labels, data: _data }: CoreChartProps) => {
  return (
    <Doughnut
      data={{ datasets: [{ ...doghnutDataset, data: _data }], labels: labels }}
      options={options}
    />
  )
}
