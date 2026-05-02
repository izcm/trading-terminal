import { useEffect, useRef, useState } from 'react'

type PopoverProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
}

export function Popover({ trigger, children, align = 'right' }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(v => !v)} className="cursor-pointer flex items-center">
        {trigger}
      </div>

      {open && (
        <div
          className={`absolute top-full mt-1 z-50 whitespace-nowrap p-2 ${align === 'right' ? 'right-0' : 'left-0'}`}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-soft)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
