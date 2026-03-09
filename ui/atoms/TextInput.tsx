interface TextInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function TextInput({ placeholder, value, onChange }: TextInputProps) {
  return (
    <input
      className="card px-9 py-2 w-full"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
    />
  )
}
