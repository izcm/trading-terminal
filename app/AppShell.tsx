'use client'

import dynamic from 'next/dynamic'

import { NavSidebar } from '@/ui/organisms/core/NavSidebar'

const Header = dynamic(() => import('@/ui/organisms/core/Header').then(m => m.Header), {
  ssr: false,
})

// ❗ NB REMEMBER THIS IS NOT IN USE RN
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen font-mono">
      <NavSidebar />
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {/* todo: skip to main on tab */}
        {children}
      </main>
    </div>
  )
}
