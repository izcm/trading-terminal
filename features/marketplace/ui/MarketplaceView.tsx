'use client' // boundry is here!

import { useEffect, useState } from 'react'

import { FeedTab, type FeedProps } from './FeedTab'
import { SalesTab, type SalesProps } from './SalesTab'
import { ExploreTab, type ExploreProps } from './ExploreTab'

import { NavSidebar } from '@/ui/organisms'

type View = 'feed' | 'sales' | 'explore'

type Props = {
  feedProps: FeedProps
  salesProps: SalesProps
  collectionsProps: ExploreProps
  initialView: View
}

export function MarketplaceView({
  feedProps,
  salesProps,
  collectionsProps: exploreProps,
  initialView,
}: Props) {
  const [view, setView] = useState<View>('feed')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      // don't trigger while typing
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (e.key === 'f') setView('feed')
      if (e.key === 's') setView('sales')
      if (e.key === 'e') setView('explore')
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-screen font-mono">
      <NavSidebar />
      <main className="flex-1 mx-auto max-w-7xl px-4">
        {/* Skip navigation link */}
        <div className="h-full flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 px-1 my-4">
            <button className="px-3 py-1 text-sm font-semibold rounded-lg border border-border-soft hover:border-accent hover:text-accent cursor-pointer transition">
              [ Swords ]
            </button>

            <button className="px-3 py-1 text-sm font-semibold rounded-lg border border-border-soft hover:border-accent hover:text-accent cursor-pointer transition">
              [ Elixirs ]
            </button>

            <button className="px-3 py-1 text-sm font-semibold rounded-lg border border-border-soft hover:border-accent hover:text-accent cursor-pointer transition">
              [ Shields ]
            </button>

            <button className="px-3 py-1 text-sm font-semibold rounded-lg border border-border-soft hover:border-accent hover:text-accent cursor-pointer transition">
              [ Eggs ]
            </button>
          </div>
          <>
            {view === 'feed' && <FeedTab {...feedProps} />}
            {view === 'sales' && <SalesTab {...salesProps} />}
            {view === 'explore' && <ExploreTab {...exploreProps} />}
          </>
        </div>
      </main>
    </div>
  )
}
