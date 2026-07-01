type Props = {
  label: string
  value: string | number
}

export const LabeledValue = ({ label, value }: Props) => (
  <div className="flex flex-col items-center">
    <span className="text-sm">{value}</span>
    <span className="text-muted text-xs">{label}</span>
  </div>
)
