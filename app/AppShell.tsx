'use client'

import dynamic from 'next/dynamic'
import { Providers } from './providers/Providers'

const Header = dynamic(() => import('@/components/organisms/Header').then(m => m.Header), {
  ssr: false,
})

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <a id="forward-main" href="#main" className="sr-only focus:not-sr-only focus:underline px-2">
        Skip to main content
      </a>
      <div id="page-wrapper" className="w-full min-h-screen p-4 font-mono py-4 mt-4">
        {/* Skip navigation link */}
        {children}
      </div>
      <footer className="text-xs text-muted py-6 text-center">
        © 2025 A2Z Blocks — Humbly built.
      </footer>
    </div>
  )
}
