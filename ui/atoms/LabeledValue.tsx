import { ReactNode } from 'react'

type Props = {
  label: ReactNode
  value: ReactNode
}

export const LabeledValue = ({ label, value }: Props) => (
  <div className="flex flex-col items-center">
    <span className="text-sm">{value}</span>
    <span className="text-muted text-xs">{label}</span>
  </div>
)
