import { useRef } from 'react'

import { useTheme } from '@/lib/hooks/use-theme'
import { GalleryItem } from '@/ui/molecules'

export function ThemePicker({ themes }: { themes: string[] }) {
  const { theme, applyTheme: setTheme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      onKeyDown={e => {
        const buttons = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])

        const i = buttons.indexOf(document.activeElement as HTMLButtonElement)
        if (i === -1) return

        if (e.key === 'ArrowRight') {
          e.preventDefault()
          const next = (i + 1) % buttons.length
          buttons[next]?.focus()
          setTheme(themes[next])
        }

        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          const next = (i - 1 + buttons.length) % buttons.length
          buttons[next]?.focus()
          setTheme(themes[next])
        }
      }}
      className="flex gap-2 rounded-lg max-w-[400px]"
    >
      {themes.map(t => {
        const selected = theme === t

        return (
          <button
            key={t}
            autoFocus={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setTheme(t)}
            aria-pressed={selected}
            className="
              rounded-lg p-1 outline-none cursor-pointer
              focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <GalleryItem image={`/themes/${t}.png`} title={t} />
          </button>
        )
      })}
    </div>
  )
}
