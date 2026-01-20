import type { Hex32 } from '@/lib/utils/format/hex32'

export const Stat = <T extends bigint | Hex32>({
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
      <span>{format(value) === '0.00' ? '----' : format(value)}</span>
      {typeof value === 'bigint' && <span>ETH</span>}
    </div>
  )
}
