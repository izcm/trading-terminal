import { ReactNode } from 'react'

export type DetailField<T> = {
  label: string
  getValue: (item: T) => ReactNode
  className?: string
}

function DetailRow({
  label,
  value,
  className,
}: {
  label: string
  value: ReactNode
  className?: string
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={className}>{value}</span>
    </div>
  )
}

export function DetailFields<T>({ data, fields }: { data: T; fields: DetailField<T>[] }) {
  return (
    <>
      {fields.map((field, i) => (
        <DetailRow
          key={i}
          label={field.label}
          value={field.getValue(data)}
          className={field.className}
        />
      ))}
    </>
  )
}
