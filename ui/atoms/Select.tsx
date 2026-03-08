'use client'

interface SelectProps {
  options: string[]
  value?: string
  onChange?: (value: string) => void
}

export function Select({ options, value, onChange }: SelectProps) {
  return (
    <select
      className="border border-default rounded px-2 py-1 text-sm bg-surface"
      value={value}
      onChange={e => onChange?.(e.target.value)}
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
