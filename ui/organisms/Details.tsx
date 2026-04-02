import type { Hex } from '@/domain/shared/eth'
import { truncateHex } from '@/domain/shared/utils/fmt/hex'

import { Copyable } from '../atoms'
import { DetailFields, type DetailField } from '../molecules'

// --- badge ---

const badgeByType = {
  ask: 'bg-ask/10 text-ask',
  bid: 'bg-bid/10 text-bid',
  unknown: 'invisible',
}

type BadgeProps = {
  type: keyof typeof badgeByType
}

const Badge = ({ type }: BadgeProps) => (
  <span className={`text-xs font-semibold px-2 py-1 rounded ${badgeByType[type]}`}>
    {type.toUpperCase()}
  </span>
)

// --- copyable field ---

export const HexDetailField = (value: Hex, className?: string) => (
  <Copyable className={className} value={value}>
    {truncateHex(value)}
  </Copyable>
)

// --- details ---

export type DetailsProps<T> = {
  item: T
  title?: {
    field: DetailField<T>
    badge: BadgeProps
  }
  detailsFields: DetailField<T>[]
  bottomFields?: DetailField<T>[] // are set at bottom of list
}

export function Details<T>({ item, title, detailsFields, bottomFields }: DetailsProps<T>) {
  if (!item) {
    return <div className={`p-4 text-sm`}>select a BIPBAPBOP</div>
  }

  return (
    <div className={`h-full flex flex-col p-4 text-sm justify-between`} tabIndex={-1}>
      {title && (
        <div className="flex justify-between text-start">
          <div className="flex flex-col">
            <span className="text-xs">{title.field.label}</span>
            <span className="font-medium">{title.field.getValue(item)}</span>
          </div>
          <Badge type={title.badge.type} />
        </div>
      )}

      {/* details */}
      <div className="flex flex-col gap-4">
        <DetailFields data={item} fields={detailsFields} />
      </div>

      {/* timing */}
      {bottomFields && (
        <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
          <DetailFields data={item} fields={bottomFields} />
        </div>
      )}
    </div>
  )
}
