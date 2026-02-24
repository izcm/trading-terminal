'use client'

import type { ReactNode } from 'react'
type SidebarContainerProps = {
  children: ReactNode
}

export function SidebarContainer({ children }: SidebarContainerProps) {
  return (
    <aside className="h-full w-[250px] flex flex-col shrink-0 border-r border-soft bg-surface/12">
      {children}
    </aside>
  )
}
