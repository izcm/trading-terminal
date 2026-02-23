import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<HTMLElement>(null)

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return

    lastFocusedRef.current = document.activeElement as HTMLElement | null

    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()

    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
      lastFocusedRef.current?.focus()
    }
  }, [onClose, isOpen])

  useEffect(() => {
    if (!isOpen) return
    lastFocusedRef.current = document.activeElement as HTMLElement | null
  }, [isOpen])

  // focus on first elegible item in modal
  useEffect(() => {
    if (!isOpen) return

    const el = containerRef.current
    if (!el) return

    const focusable = el.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    focusable?.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        animate-fadeIn fixed z-[999]
      "
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="
          bg-surface
          border border-default
          rounded-lg
          shadow-lg p-4"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
