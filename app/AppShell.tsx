'use client'

import dynamic from 'next/dynamic'

import { NavSidebar } from '@/ui/organisms/core/NavSidebar'

const Header = dynamic(() => import('@/ui/organisms/core/Header').then(m => m.Header), {
  ssr: false,
})

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen font-mono">
      <NavSidebar />
      <main className="flex-1 max-w-7xl">
        {/* Skip navigation link */}
        {children}
      </main>
    </div>
  )
}
