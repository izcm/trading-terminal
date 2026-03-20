interface TextInputProps {
  placeholder?: string
  defaultValue?: string
  onSubmit?: (value: string) => void
}

export function TextInput({ placeholder, defaultValue, onSubmit }: TextInputProps) {
  return (
    <input
      className="card px-4 py-2 w-full bg-black/10 text-muted"
      placeholder={placeholder}
      defaultValue={defaultValue}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onSubmit?.(e.currentTarget.value)
        }
      }}
    />
  )
}
