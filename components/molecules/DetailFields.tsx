'use client'

export type DetailField<T> = {
  label: string
  getValue: (item: T) => string | number
  className?: string
}

function DetailRow({
  label,
  value,
  className,
}: {
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500">{label}</span>
      <span className={className}>{value}</span>
    </div>
  )
}

export function DetailFields<T>({ data, fields }: { data: T; fields: DetailField<T>[] }) {
  return (
    <>
      {fields.map(field => (
        <DetailRow
          key={field.label}
          label={field.label}
          value={field.getValue(data)}
          className={field.className}
        />
      ))}
    </>
  )
}
