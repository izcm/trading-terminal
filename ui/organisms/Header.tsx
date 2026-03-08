'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export function Header() {
  return (
    <header
      className="
        w-full 
        flex items-center justify-between 
        px-6 py-2
        border-b border-default
        backdrop-blur-md
      "
    >
      {/* Left side - brand */}
      <Link
        href="/"
        className="
          text-xl font-semibold 
          hover:text-[var(--accent)]
          transition-colors font-mono
        "
      >
        d | mrkt
      </Link>

      {/* Right side - nav + wallet */}
      <div className="flex items-center gap-5">
        <nav className="hidden sm:flex items-center gap-4"></nav>

        {/* Wallet connect */}
        <ConnectButton />
      </div>
    </header>
  )
}
