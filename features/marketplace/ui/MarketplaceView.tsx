'use client' // boundry is here!

import { useEffect, useState } from 'react'

import { FeedTab, type FeedProps } from './FeedTab'
import { SalesTab, type SalesProps } from './SalesTab'
import { ExploreTab, type CollectionsProps } from './ExploreTab'

import { NavSidebar } from '@/ui/organisms'

type View = 'feed' | 'sales' | 'explore'

type Props = {
  feedProps: FeedProps
  salesProps: SalesProps
  collectionsProps: CollectionsProps
  initialView: View
}

export function MarketplaceView({
  feedProps,
  salesProps,
  collectionsProps: exploreProps,
  initialView,
}: Props) {
  const [view, setView] = useState<View>(initialView)
  console.log(exploreProps)

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
      <main className="flex-1 mx-auto p-4 max-w-7xl">
        {/* Skip navigation link */}
        <div className="h-full flex flex-col gap-4">
          {/* <div className="basis-1/20 items-center rounded-2xl bg-surface/24">
            <span>actionbar</span>
          </div> */}
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
