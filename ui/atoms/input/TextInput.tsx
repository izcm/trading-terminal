import React, { useState } from 'react'

type Props = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  ref?: React.Ref<HTMLInputElement>
}

// merketplaceView is a heavy component and shouldnt rerender on every keystroke
// so internal state is added. then render only happens on submit

export function TextInput({ placeholder, value, onChange, onSubmit, ref }: Props) {
  const [internal, setInternal] = useState(value ?? '')
  const [prevValue, setPrevValue] = useState(value)

  // if parent changed value prop - sync internal to match
  if (prevValue !== value) {
    setPrevValue(value)
    setInternal(value ?? '')
  }

  return (
    <input
      ref={ref}
      className="px-4 py-2 w-full bg-black/10 text-muted rounded-lg border border-default"
      placeholder={placeholder}
      value={internal}
      onChange={e => {
        setInternal(e.currentTarget.value)
        onChange?.(e.currentTarget.value)
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onSubmit?.(internal)
        }
      }}
    />
  )
}
