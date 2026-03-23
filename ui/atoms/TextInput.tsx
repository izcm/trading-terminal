type Props = {
  placeholder?: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
}

export function TextInput({ placeholder, defaultValue, value, onChange, onSubmit }: Props) {
  return (
    <input
      className="card px-4 py-2 w-full bg-black/10 text-muted"
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
