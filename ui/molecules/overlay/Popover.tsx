import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils/cn'

type PopoverProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
  /** Overrides the dropdown's default anchored positioning (e.g. to center it as a wide sheet). */
  contentClassName?: string
}

export function Popover({ trigger, children, align = 'right', contentClassName }: PopoverProps) {
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
          className={cn(
            'absolute top-full mt-1 z-50 whitespace-nowrap p-2 bg-surface border border-default',
            align === 'right' ? 'right-0' : 'left-0',
            contentClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
