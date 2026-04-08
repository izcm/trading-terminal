import React from 'react'

type Props = {
  placeholder?: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  ref?: React.Ref<HTMLInputElement>
}

export function TextInput({ placeholder, defaultValue, value, onChange, onSubmit, ref }: Props) {
  return (
    <input
      ref={ref}
      className="px-4 py-2 w-full bg-black/10 text-muted rounded-lg border border-default"
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={e => onChange?.(e.currentTarget.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onSubmit?.(e.currentTarget.value)
        }
      }}
    />
  )
}
