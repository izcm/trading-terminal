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
    <div className="flex w-full border-b border-soft">
      {items.map(item => {
        const active = item === value

        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`
              flex-1 py-2 text-center border-b-2 transition-colors duration-200 cursor-pointer
              ${
                active
                  ? 'border-accent/60 text-accent-weak'
                  : 'border-transparent hover:text-accent/60 hover:border-accent/40'
              }
            `}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}
