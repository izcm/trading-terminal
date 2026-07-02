import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { FocusTrap } from 'focus-trap-react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  escTxt?: string
  selfManagesFocus?: boolean
  children: ReactNode
}

export function Modal({
  isOpen,
  onClose,
  children,
  escTxt = 'Close',
  selfManagesFocus,
}: ModalProps) {
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  // close on Escape always, close on X unless focus is on a non-numeric text input
  const handler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement

    const isNumeric = (target as HTMLInputElement).dataset?.numeric !== undefined
    const typingText =
      !isNumeric &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)

    if (e.key === 'Escape') {
      onClose()
      return
    }

    if (!typingText && e.key.toLowerCase() === 'x') {
      onClose()
    }
  }

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return

    lastFocusedRef.current = document.activeElement as HTMLElement | null

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
      <FocusTrap
        focusTrapOptions={{
          initialFocus: selfManagesFocus ? false : '#modal-close-btn',
          clickOutsideDeactivates: true,
        }}
      >
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
          <button id="modal-close-btn" className="btn btn-secondary outline-none" onClick={onClose}>
            {escTxt}
          </button>
        </div>
      </FocusTrap>
    </div>
  )
}
