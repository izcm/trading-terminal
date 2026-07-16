import React, { useState } from 'react'

import { cn } from '@/lib/utils/cn'

type Props = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  ref?: React.Ref<HTMLInputElement>
  numeric?: boolean
  className?: string
}

// merketplaceView is a heavy component and shouldnt rerender on every keystroke
// so internal state is added. then render only happens on submit

export function TextInput({
  placeholder,
  value,
  onChange,
  onSubmit,
  ref,
  numeric,
  className,
}: Props) {
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
      className={cn(
        'px-4 py-2 w-full bg-black/10 text-muted rounded-lg border border-default',
        className
      )}
      placeholder={placeholder}
      value={internal}
      {...(numeric && { inputMode: 'decimal', pattern: '[0-9.]*', 'data-numeric': true })}
      onChange={e => {
        const value = numeric
          ? e.currentTarget.value.replace(/[^0-9.]/g, '')
          : e.currentTarget.value
        setInternal(value)
        onChange?.(value)
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onSubmit?.(internal)
        } else if (e.key === 'Escape') {
          setInternal('')
        }
      }}
    />
  )
}
