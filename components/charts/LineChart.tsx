'use client'

import { Sale } from '@/data/types/sale'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement)

type LineChartProps = {
  labels: string[]
  data: number[]
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 20,
  },
  scales: {
    y: {
      min: 0,
      grid: {
        lineWidth: 0.5,
      },
    },
    x: {
      grid: {
        lineWidth: 0.5,
      },
    },
  },
}

const data = {
  datasets: [
    {
      data: [1, 2, 5],
      // parsing: {
      //   xAxisKey: "key",
      //   yAxisKey: "value,"
      // },
      borderColor: '#6d75ff',
      tension: 0.4,
    },
  ],
}

export const LineChart = ({ labels, data: _data }: LineChartProps) => {
  return (
    <Line
      data={{ datasets: [{ ...data.datasets[0], data: _data }], labels: labels }}
      options={options}
    />
  )
}
