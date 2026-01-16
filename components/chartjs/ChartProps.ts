const purpleBars = [
  'rgba(109, 117, 255, 0.4)',
  'rgba(109, 117, 255, 0.6)',
  'rgba(109, 117, 255, 0.8)',
]

const defaultLook = {
  color: '#6d75ff',
  borderWidth: 1.6,
  borderRadius: 4,
  tension: 0.3,
}

export type CoreChartProps = {
  labels: string[]
  data: number[]
}

export const lineDataset = {
  borderColor: defaultLook.color,
  borderWidth: defaultLook.borderWidth,
  tension: defaultLook.tension,
}

export const barDataset = {
  backgroundColor: 'transparent',
  borderColor: defaultLook.color,
  borderWidth: defaultLook.borderWidth,
  borderRadius: defaultLook.borderRadius,
}

export const defaultOptions = {
  maintainAspectRatio: false,
  layout: {
    padding: 20,
  },
  scales: {
    y: {
      min: 0,
      grid: {
        lineWidth: 0.2,
      },
    },
    x: {
      grid: {
        lineWidth: 0.2,
      },
    },
  },
}
