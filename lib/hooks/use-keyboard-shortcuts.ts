import { useEffect } from 'react'

export function useKeyboardShortcuts(map: Record<string, () => void>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      // disable on cntrl / cmd
      if (e.ctrlKey || e.metaKey || e.altKey) return

      // don't trigger while typing
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      const fn = map[e.key]
      if (!fn) return

      e.preventDefault()
      fn()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [map])
}
