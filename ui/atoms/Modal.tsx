import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { FocusTrap } from 'focus-trap-react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  escTxt?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, children, escTxt = 'Close' }: ModalProps) {
  const lastFocusedRef = useRef<HTMLElement | null>(null)

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

  if (!isOpen) return null

  return (
    <div
      className="
        fixed inset-0 z-[999] flex items-center justify-center
        bg-black/50 backdrop-blur-sm animate-fadeIn
      "
      role="dialog"
      onClick={onClose}
    >
      <FocusTrap>
        <div
          className="
            flex flex-col gap-2
            bg-primary/60 backdrop-blur-lg
            border border-default
            rounded-lg
            shadow-lg p-2"
          onClick={e => e.stopPropagation()}
        >
          {children}
          <button className="btn btn-secondary" onClick={onClose}>
            {escTxt}
          </button>
        </div>
      </FocusTrap>
    </div>
  )
}
