import { ThemePicker } from './ThemePicker'

const THEMES = ['runtime', 'void']

export function SettingsMenu() {
  return (
    <div className="flex flex-col gap-4 p-1">
      <span className="text-sm text-muted">Choose theme:</span>
      <ThemePicker themes={THEMES} />
    </div>
  )
}
