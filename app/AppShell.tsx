'use client'

import dynamic from 'next/dynamic'

// todo: move to centralized icons.ts
import { ChartArea, LayoutGrid, Newspaper } from 'lucide-react'

import { NavSidebar } from '@/ui/organisms/core/NavSidebar'

const Header = dynamic(() => import('@/ui/organisms/core/Header').then(m => m.Header), {
  ssr: false,
})

const navItems = [
  {
    title: 'feed',
    icon: Newspaper,
    href: '/',
  },
  {
    title: 'sales',
    icon: ChartArea,
    href: '/sales',
  },
  {
    title: 'collections',
    icon: LayoutGrid,
    href: '/explore',
  },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen font-mono">
      <NavSidebar />

      <main className="flex-1 mx-auto p-4 max-w-7xl">
        {/* Skip navigation link */}
        {children}
      </main>
    </div>
  )
}
