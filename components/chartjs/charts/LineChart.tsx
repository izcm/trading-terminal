'use client'

import { Line } from 'react-chartjs-2'
import '../chartjs'

import type { CoreChartProps } from '../ChartProps'
import { defaultOptions as options, lineDataset } from '../ChartProps'

export const LineChart = ({ labels, data: _data }: CoreChartProps) => {
  return (
    <Line
      data={{ datasets: [{ ...lineDataset, data: _data }], labels: labels }}
      options={options}
    />
  )
}
