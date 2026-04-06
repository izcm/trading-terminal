import { Toaster } from 'sonner'
import type { Metadata } from 'next'

import './globals.css'

import { Providers } from './providers/Providers'

export const metadata: Metadata = {
  title: 'dmrkt client',
  description: 'an nft playground',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="runtime" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* <a
          href="#forward-main"
          className="sr-only focus:not-sr-only focus:underline absolute top-2 left-2 z-50"
        >
          Skip Header
        </a> */}
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  )
}
