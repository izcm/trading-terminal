'use client'

import { useEffect, useState } from 'react'

import { FeedTab, FeedProps } from './FeedTab'
import { SalesTab, SalesProps } from './SalesTab'

type View = 'feed' | 'sales'

type Props = {
  feedProps: FeedProps
  salesProps: SalesProps
  initialView: View
}

export function MarketplaceView({ feedProps, salesProps, initialView }: Props) {
  const [view, setView] = useState<View>(initialView)

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
    <div className="h-full flex flex-col gap-4">
      <div className="basis-1/20 items-center rounded-2xl bg-surface/24">
        <span>hello</span>
      </div>
      {view === 'feed' && <FeedTab {...feedProps} />}
      {view === 'sales' && <SalesTab {...salesProps} />}
    </div>
  )
}
