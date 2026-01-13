'use client'

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement)

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

export const LineChart = () => {
  const datasets = [
    {
      data: [15, 8, 25, 16, 12],
      borderColor: '#d798d0',
      tension: 0.4,
    },
  ]

  return (
    <Line
      data={{
        labels: ['A', 'B', 'C'],
        datasets: datasets,
      }}
      options={options}
    />
  )
}
