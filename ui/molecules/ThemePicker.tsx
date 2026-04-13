import { useTheme } from '@/lib/hooks/use-theme'

export function ThemePicker({ themes }: { themes: string[] }) {
  const { theme, setTheme } = useTheme()

  return (
    <ul>
      {themes.map(t => (
        <li key={t}>
          <button onClick={() => setTheme(t)}>{t}</button>
        </li>
      ))}
    </ul>
  )
}
