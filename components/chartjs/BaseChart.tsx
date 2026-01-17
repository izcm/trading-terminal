'use client'

import { Chart } from 'react-chartjs-2'

import type { CoreChartProps } from './ChartProps'
import { defaultOptions as options } from './ChartProps'

export const BaseChart = ({ type, labels, datasets }: CoreChartProps) => {
  return <Chart type={type} data={{ labels, datasets }} options={options} />
}
