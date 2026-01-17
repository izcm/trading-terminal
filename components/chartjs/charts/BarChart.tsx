'use client'

import { Bar } from 'react-chartjs-2'

import type { CoreChartProps } from '../ChartProps'
import { defaultOptions as options, barDataset } from '../ChartProps'

export const BarChart = ({ labels, data: _data }: CoreChartProps) => {
  return (
    <Bar
      data={{
        datasets: [
          {
            ...barDataset,
            data: _data,
          },
        ],
        labels: labels,
      }}
      options={options}
    />
  )
}
