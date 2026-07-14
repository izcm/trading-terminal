import { useTheme } from '@/lib/hooks/use-theme'
import { ArrowRow } from '@/ui/atoms'
import { ArrowList, GalleryItem } from '@/ui/molecules'

const THEMES = ['runtime', 'void']

export function SettingsMenu() {
  const { theme, applyTheme: setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-4 p-1">
      <span className="text-sm text-subtle">Themes</span>
      <ArrowList
        items={THEMES}
        getId={t => t}
        selectedId={theme}
        onSelect={setTheme}
        direction="horizontal"
        className="flex gap-2 rounded-lg max-w-[400px]"
      >
        {({ item: t, isSelected, onSelect }) => (
          <ArrowRow
            key={t}
            isSelected={isSelected}
            onSelect={onSelect}
            dataId={t}
            className="rounded-lg p-1 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <GalleryItem image={`/themes/${t}.png`} title={t} />
          </ArrowRow>
        )}
      </ArrowList>
    </div>
  )
}
