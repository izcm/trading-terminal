export const Stat = <T extends bigint | `0x${string}`>({
  value,
  label,
  format,
}: {
  value: T
  label: string
  format: (value: T) => string
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-stat/70">{label}</span>
      <span>{format(value)}</span>
      {typeof value === 'bigint' && <span>ETH</span>}
    </div>
  )
}
