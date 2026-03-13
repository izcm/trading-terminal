'use client' // boundry is here!

import { useEffect, useState } from 'react'

import { FeedTab, type FeedProps } from './FeedTab'
import { SalesTab, type SalesProps } from './SalesTab'
import { ExploreTab, type ExploreProps } from './ExploreTab'

type View = 'feed' | 'sales' | 'explore'

type Props = {
  feedProps: FeedProps
  salesProps: SalesProps
  collectionsProps: ExploreProps
  initialView: View
}

const navItems = [
  {
    title: 'feed',
    id: 'feed',
  },
  {
    title: 'sales',
    id: 'sales',
  },
  {
    title: 'explore',
    id: 'explore',
  },
]

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
    <div className="mx-auto flex gap-12 h-screen justify-center overflow-hidden font-mono">
      {/* sidebar */}
      <aside className="flex items-center">
        <div className="flex flex-col gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              data-active={view === item.id}
              className="btn btn-ghost min-w-[120px]"
            >
              {item.title}
            </button>
          ))}
        </div>
      </aside>

      {/* ---- main content ---- */}
      <main className="flex">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
          <div className="my-4 flex items-center justify-center gap-2 px-1 text-accent">
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
          <div className="min-h-0 flex-1">
            {view === 'feed' && <FeedTab {...feedProps} />}
            {view === 'sales' && <SalesTab {...salesProps} />}
            {view === 'explore' && <ExploreTab {...exploreProps} />}
          </div>
        </div>
      </main>
    </div>
  )
}
