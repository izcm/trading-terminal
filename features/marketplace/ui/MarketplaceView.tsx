'use client' // boundry is here!

import { useEffect, useState } from 'react'

import { FeedTab, FeedProps } from './FeedTab'
import { SalesTab, SalesProps } from './SalesTab'
import { NavSidebar } from '@/ui/organisms'

type View = 'feed' | 'sales'

type Props = {
  feedProps: FeedProps
  salesProps: SalesProps
  initialView: View
}

export function MarketplaceView({ feedProps, salesProps, initialView }: Props) {
  const [view, setView] = useState<View>('sales')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      // don't trigger while typing
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (e.key === 'f') setView('feed')
      if (e.key === 's') setView('sales')
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
          </>
        </div>
      </main>
    </div>
  )
}
