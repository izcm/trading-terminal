import { Chart } from 'react-chartjs-2'

import type { CoreChartProps } from './chartjs-defaults'
import { defaultOptions as options } from './chartjs-defaults'

// do onResize https://www.chartjs.org/docs/latest/configuration/responsive.html
export function BaseChart({ type, labels, datasets }: CoreChartProps) {
  return (
    <div className="mx-auto  w-9/10">
      <Chart type={type} data={{ labels, datasets }} options={options} />
    </div>
  )
}
