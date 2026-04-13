import { useRef } from 'react'
import { useTheme } from '@/lib/hooks/use-theme'
import { GalleryItem } from './GalleryItem'

export function ThemePicker({ themes }: { themes: string[] }) {
  const { theme, setTheme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      tabIndex={0}
      onFocus={e => {
        // only when container itself is focused
        if (e.target !== e.currentTarget) return

        ref.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus()
      }}
      className="flex gap-2 rounded-lg max-w-[400px]"
    >
      {themes.map(t => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          aria-pressed={theme === t}
          className="
            rounded-lg p-1 outline-none
            focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <GalleryItem image={`/themes/${t}.png`} title={t} />
        </button>
      ))}
    </div>
  )
}
