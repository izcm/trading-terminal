import { useEffect, useState } from 'react'

/**
 * Hook for setting / reading current theme
 * Instead of a global theme provider, the app simply stores theme name in local storage
 */
export function useTheme() {
  const [theme, setTheme] = useState<string>(
    () => (localStorage.getItem('theme') as string | null) ?? 'runtime'
  )

  function apply(t: string) {
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('theme', t) // store in browser for future session
    setTheme(t)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, applyTheme: apply }
}
