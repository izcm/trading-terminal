import type { Hex } from '@/domain/shared/types/eth'

export function Stat<T extends bigint | Hex | number>({
  value,
  label,
  fmtFn,
}: {
  value: T
  label: string
  fmtFn?: (value: T) => string
}) {
  const fmt = fmtFn ?? ((v: T) => String(v))

  const out = fmt(value)

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-accent">{label}</span>
      <span>{out === '0.00' ? '----' : out}</span>
      {typeof value === 'bigint' && <span>ETH</span>}
    </div>
  )
}
