'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { Newspaper, LayoutGrid, ChartArea } from 'lucide-react'
import { Providers } from './providers/Providers'
import { SidebarContainer } from '@/components/atoms'
import { NavItem } from '@/components/molecules/NavItem'

const Header = dynamic(() => import('@/components/organisms/Header').then(m => m.Header), {
  ssr: false,
})

const navItems = [
  {
    title: 'feed',
    icon: Newspaper,
    href: '/',
  },
  {
    title: 'analytics',
    icon: ChartArea,
    href: '/',
  },
  {
    title: 'collections',
    icon: LayoutGrid,
    href: '/collections',
  },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div id="page-wrapper" className="flex items-center h-screen gap-4 font-mono">
        <SidebarContainer>
          {/* ---- BRAND / TITLE ---- */}
          <div className="px-3 py-4 text-start border-b border-soft">
            <div className="text-sm text-muted">d | mrkt</div>
            <div className="text-xs text-muted/70">market client</div>
          </div>

          {/* ---- NAVIGATION ---- */}
          <div className="flex-1">
            {navItems.map(item => {
              const Icon = item.icon

              return (
                <NavItem key={item.href} active={false}>
                  <Icon size={16} />
                  <Link href={item.href}>{item.title}</Link>
                </NavItem>
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

        <main className="flex-1 p-4 my-4 mx-auto">
          {/* Skip navigation link */}
          {children}
        </main>
      </div>
    </div>
  )
}
