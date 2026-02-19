'use client'

import dynamic from 'next/dynamic'
import { Providers } from './providers/Providers'
import { SidebarContainer } from '@/components/atoms'

const Header = dynamic(() => import('@/components/organisms/Header').then(m => m.Header), {
  ssr: false,
})

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div id="page-wrapper" className="flex items-center h-screen gap-4 font-mono ">
        <SidebarContainer>Hello</SidebarContainer>
        <main className="flex-1 p-4 my-4 mx-auto">
          {/* Skip navigation link */}
          {children}
        </main>
      </div>
    </div>
  )
}
