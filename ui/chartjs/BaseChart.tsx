'use client'

import { Chart } from 'react-chartjs-2'

import type { CoreChartProps } from './primitives'
import { defaultOptions as options } from './primitives'

export function BaseChart({ type, labels, datasets }: CoreChartProps) {
  return (
    <div className="w-full h-full">
      <Chart type={type} data={{ labels, datasets }} options={options} />
    </div>
  )
}
