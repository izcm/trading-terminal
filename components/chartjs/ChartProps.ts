import { ChartData, ChartDataset } from 'chart.js'

const purpleShades = [
  'rgba(99, 107, 255, 0.32)',
  'rgba(109, 117, 255, 0.24)',
  'rgba(125, 110, 255, 0.16)',
]

const defaultLook = {
  color: '#38bff89b',
  borderWidth: 2,
  borderRadius: 4,
  tension: 0.3,
}

export type CoreChartProps = {
  type: keyof DatasetPresetMap
  labels: string[]
  datasets: ChartDataset<keyof DatasetPresetMap, number[]>[]
}

export const defaultOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  layout: {
    padding: 20,
  },
}

type DatasetPresetMap = {
  bar: Omit<ChartDataset<'bar', number[]>, 'data' | 'label'>
  line: Omit<ChartDataset<'line', number[]>, 'data' | 'label'>
  doughnut: Omit<ChartDataset<'doughnut', number[]>, 'data' | 'label'>
}

export function createDataset(
  type: keyof DatasetPresetMap,
  data: number[],
  label?: string
): ChartDataset<keyof DatasetPresetMap, number[]> {
  return {
    ...datasetPresets[type],
    data,
    label,
  }
}

const datasetPresets: DatasetPresetMap = {
  bar: {
    type: 'bar',
    backgroundColor: 'transparent',
    borderColor: defaultLook.color,
    borderWidth: defaultLook.borderWidth,
    borderRadius: defaultLook.borderRadius,
  },

  line: {
    type: 'line',
    borderColor: defaultLook.color,
    borderWidth: defaultLook.borderWidth,
    tension: defaultLook.tension,
    fill: false,
    pointRadius: 3,
  },

  doughnut: {
    type: 'doughnut',
    backgroundColor: purpleShades,
    borderColor: 'transparent',
  },
}
