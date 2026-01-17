const purpleShades = [
  'rgba(99, 107, 255, 0.32)', // cooler, more blue-leaning
  'rgba(109, 117, 255, 0.24)', // your base purple
  'rgba(125, 110, 255, 0.16)', // warmer, slightly magenta
]

const defaultLook = {
  color: '#6d75ff96',
  borderWidth: 2,
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

export const doghnutDataset = {
  backgroundColor: purpleShades,
  borderColor: 'transparent',
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
