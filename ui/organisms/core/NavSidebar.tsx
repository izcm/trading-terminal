'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

// todo: move to centralized icons.ts
import { ChartArea, LayoutGrid, Newspaper } from 'lucide-react'

import { SidebarRow } from '@/ui/molecules'

const Header = dynamic(() => import('@/ui/organisms/core/Header').then(m => m.Header), {
  ssr: false,
})

const navItems = [
  {
    title: 'feed',
    icon: Newspaper,
    id: 'feed',
  },
  {
    title: 'on-chain sales',
    icon: ChartArea,
    id: 'sales',
  },
  {
    title: 'explore',
    icon: LayoutGrid,
    id: 'explore',
  },
]

export function NavSidebar() {
  return (
    <aside className="h-full w-[250px] flex flex-col shrink-0 border-r border-soft bg-surface/16">
      {/* ---- BRAND / TITLE ---- */}
      <div className="px-3 py-4 text-start border-b border-soft">
        <div className="text-muted">d | mrkt</div>
        <div className="text-sm text-muted/70">client</div>
      </div>

      {/* ---- NAVIGATION ---- */}
      <div className="flex-1">
        {navItems.map(item => {
          const Icon = item.icon

          return (
            <SidebarRow key={`${item.id}:navbar`}>
              <Icon size={16} />
              {item.title}
            </SidebarRow>
          )
        })}
      </div>

      {/* ---- SESSION AREA ---- */}
      <div className="border-t border-soft px-3 py-4 text-start">
        <div className="text-xs text-text-muted mb-2">not connected</div>
        <div className="text-sm cursor-pointer hover:text-text transition-colors">
          connect wallet
        </div>
      </div>
    </aside>
  )
}
