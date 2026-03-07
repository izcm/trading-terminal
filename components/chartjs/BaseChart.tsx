'use client'

import { Chart } from 'react-chartjs-2'

import type { CoreChartProps } from './props'
import { defaultOptions as options } from './props'

export function BaseChart({ type, labels, datasets }: CoreChartProps) {
  return (
    <div className="w-full h-full">
      <Chart type={type} data={{ labels, datasets }} options={options} />
    </div>
  )
}
