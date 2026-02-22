'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface SelectProps {
  options: Array<{ label: string; value: string }>
  onChange: (value: string) => void
  defaultValue?: string
}

export function FormSelect({ options, onChange, defaultValue }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue || options[0]?.value)
  const ref = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find(opt => opt.value === selected)?.label || defaultValue

  const handleSelect = useCallback(
    (value: string) => {
      setSelected(value)
      onChange(value)
      setIsOpen(false)
    },
    [onChange]
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-default rounded px-3 py-2 text-left flex items-center justify-between hover:border-accent/50 transition-colors"
      >
        <span>{selectedLabel}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-default rounded bg-surface shadow-lg z-50">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-3 py-2 hover:bg-accent/20 transition-colors ${
                selected === opt.value ? 'bg-accent/30 font-medium' : ''
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
