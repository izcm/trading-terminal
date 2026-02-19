import { ReactNode } from 'react'

export function NavItem({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div
      className={`
        flex items-center gap-3 px-3 py-2 text-sm cursor-pointer
        transition-colors
        ${
          active
            ? 'text-base-content border-l-2 border-primary bg-base-200/40'
            : 'text-base-content/60 hover:text-base-content hover:bg-base-200/20'
        }
      `}
    >
      {children}
    </div>
  )
}
