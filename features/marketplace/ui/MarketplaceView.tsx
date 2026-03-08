'use client'

import { ReactNode, useState } from 'react'

import { Sale } from '@/domain/sale'
import { Paginated } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import { FeedProps } from './Feed'

type Props = {
  feedProps: FeedProps
  activityProps: Paginated<Sale>
}

export function MarketplaceView({ feedProps, activityProps }: Props) {
  const [view, setView] = useState<'feed' | 'activity'>('feed')

  return (
    <div className="h-full flex flex-col">
      {/* anchors / nav */}
      <div className="flex gap-2">
        <button onClick={() => setView('feed')}>feed</button>
        <button onClick={() => setView('activity')}>activity</button>
      </div>

      {/* tabs */}
      {view === 'feed' && <FeedTab {...feedProps} />}
      {view === 'activity' && <ActivityTab {...activityProps} />}
    </div>
  )
}
