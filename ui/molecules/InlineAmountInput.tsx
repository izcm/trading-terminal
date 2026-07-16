import { useEffect, useRef, useState } from 'react'

import { TextInput } from '@/ui/atoms'
import { cn } from '@/lib/utils/cn'

type InlineAmountInputProps = {
  label: string
  open: boolean
  onOpen: () => void
  onClose: () => void
  onSubmit: (amount: string) => void
  disabled?: boolean
  textPlaceholder?: string
}

export function InlineAmountInput({
  label,
  open,
  onOpen,
  onClose,
  onSubmit,
  disabled,
  textPlaceholder,
}: InlineAmountInputProps) {
  const [amount, setAmount] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function confirm() {
    if (amount) {
      onSubmit(amount)
      setAmount('')
    }

    onClose()
    buttonRef.current?.focus()
  }

  return (
    <div className="flex items-center gap-2">
      {open && (
        <TextInput
          ref={inputRef}
          value={amount}
          onChange={setAmount}
          placeholder={textPlaceholder}
          onSubmit={confirm}
          numeric
          className="
            p-0 h-5 border-l-0 border-r-0 border-t-0 rounded-none
            box-border leading-5 w-20 bg
            bg-transparent text-sm text-right
            outline-none border-b border-accent/40"
        />
      )}
      <button
        onClick={open ? confirm : onOpen}
        ref={buttonRef}
        disabled={disabled}
        className={cn(
          'cursor-pointer text-sm text-subtle underline underline-offset-2 hover:text-white',
          disabled && 'disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline'
        )}
      >
        {open ? (amount === '' ? 'Cancel' : 'Confirm') : label}
      </button>
    </div>
  )
}
