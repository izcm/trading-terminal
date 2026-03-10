import { ReactNode } from 'react'
import { DetailFields, type DetailField } from '../molecules/DetailFields'

const badgeByType = {
  ask: 'bg-ask/10 text-ask',
  bid: 'bg-bid/10 text-bid',
  unknown: 'invisible',
}

type BadgeProps = {
  type: keyof typeof badgeByType
}

export function Badge({ type }: BadgeProps) {
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded ${badgeByType[type]}`}>
      {type.toUpperCase()}
    </span>
  )
}

export type DetailsProps<T> = {
  item: T
  title?: {
    field: DetailField<T>
    badge: BadgeProps
  }
  detailsFields: DetailField<T>[]
  timingFields?: DetailField<T>[] // are set at bottom of list
}

export function Details<T>({ item, title, detailsFields, timingFields }: DetailsProps<T>) {
  if (!item) {
    return <div className="card h-full p-4 text-sm">select a BIPBAPBOP</div>
  }

  return (
    <div className="flex flex-col card h-full gap-6 p-4 text-sm" tabIndex={-1}>
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
      <DetailFields data={item} fields={detailsFields} />

      {/* timing */}
      {timingFields && (
        <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
          <DetailFields data={item} fields={timingFields} />
        </div>
      )}
    </div>
  )
}
