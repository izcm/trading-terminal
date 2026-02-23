import { ReactNode } from 'react'

type NavItemProps = {
  active?: boolean
  children: ReactNode
}

export function NavItem({ active = false, children }: NavItemProps) {
  return (
    <div
      className={`
        group flex gap-3 items-center px-3 py-4 text-sm cursor-pointer
        transition-colors border-l-2 block
        ${
          active
            ? 'border-accent bg-secondary'
            : 'text-muted border-transparent hover:text-text hover:bg-secondary/70'
        }
      `}
    >
      {children}
    </div>
  )
}
