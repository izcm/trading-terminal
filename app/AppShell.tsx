'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { NavItem, SidebarContainer } from '@/ui/molecules'
import { ChartArea, LayoutGrid, Newspaper } from 'lucide-react'

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
    title: 'chain activity',
    icon: ChartArea,
    href: '/chain-activity',
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
      <SidebarContainer>
        {/* ---- BRAND / TITLE ---- */}
        <div className="px-3 py-4 text-start border-b border-soft">
          <div className="text-muted">d | mrkt</div>
          <div className="text-sm text-muted/70">market client</div>
        </div>

        {/* ---- NAVIGATION ---- */}
        <div className="flex-1">
          {navItems.map(item => {
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href} className="block">
                <NavItem>
                  {' '}
                  <Icon size={20} />
                  {item.title}
                </NavItem>
              </Link>
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
      </SidebarContainer>

      <main className="flex-1 mx-auto p-4 max-w-7xl">
        {/* Skip navigation link */}
        {children}
      </main>
    </div>
  )
}
