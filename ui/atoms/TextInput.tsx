interface TextInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function TextInput({ placeholder, value, onChange }: TextInputProps) {
  return (
    <input
      className="card px-4 py-2 w-full bg-black/10"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange?.(e.target.value)}
    />
  )
}
