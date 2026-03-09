'use client'

import { ReactNode, useState } from 'react'

import { Sale } from '@/domain/sale'
import { Paginated } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import { Feed, FeedProps } from './Feed'

type Props = {
  feedProps: FeedProps
}

export function MarketplaceView({ feedProps }: Props) {
  const [view, setView] = useState<'feed' | 'activity'>('feed')

  return (
    <>
      {/* tabs */}
      {view === 'feed' && <Feed {...feedProps} />}
      {/* {view === 'activity' && <ActivityTab {...activityProps} />} */}
    </>
  )
}
