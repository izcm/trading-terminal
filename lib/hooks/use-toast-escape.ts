import { useEffect } from 'react'

import { dismissToasts, isToastVisible } from '@/ui/molecules/overlay/Toast'

export function useToastEscape() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape' || !isToastVisible()) return

      dismissToasts()
      e.stopImmediatePropagation()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])
}
