import { ArrowRow } from '@/ui/atoms'
import { ArrowList } from '@/ui/molecules'

/**
 * Tab navigation menu
 */
type TabsProps<T extends string> = {
  value: T
  onChange: (v: T) => void
  items: readonly T[]
}

export function Tabs<T extends string>({ value, onChange, items }: TabsProps<T>) {
  return (
    <ArrowList
      items={[...items]}
      getId={item => item}
      selectedId={value}
      onSelect={onChange}
      direction="horizontal"
      className="flex w-full border-b border-soft"
    >
      {({ item, isSelected, onSelect }) => (
        <ArrowRow
          key={item}
          isSelected={isSelected}
          onSelect={onSelect}
          dataId={item}
          className={`
            flex-1 py-2 text-center border-b-2 transition-colors duration-200 cursor-pointer
            ${
              isSelected
                ? 'border-accent/60 text-accent-weak'
                : 'border-transparent text-subtle hover:border-accent/30'
            }
          `}
        >
          {item}
        </ArrowRow>
      )}
    </ArrowList>
  )
}
