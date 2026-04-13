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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function () {
              try {
                const t = localStorage.getItem('theme') || 'runtime';
                document.documentElement.setAttribute('data-theme', t);
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'runtime');
              }
            })();`,
          }}
        />
      </head>

      <body suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  )
}
