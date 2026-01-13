'use client'

import { ReactNode } from 'react'

type SidebarContainerProps = {
  children: ReactNode
}

export const SidebarContainer = ({ children }: SidebarContainerProps) => {
  return (
    <aside
      className="w-[320px] sticky top-2 p-4 card overflow-scroll scrollbar-hide"
      style={{ height: 'calc(100vh - 16px)' }}
    >
      {children}
    </aside>
  )
}
