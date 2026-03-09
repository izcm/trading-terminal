'use client'

import { ReactNode, useState } from 'react'

import { FeedTab, FeedProps } from './FeedTab'
import { SalesTab, SalesProps } from './SalesTab'

type Props = {
  feedProps: FeedProps
  salesProps: SalesProps
}

export function MarketplaceView({ feedProps, salesProps }: Props) {
  const [view, setView] = useState<'feed' | 'sales'>('sales')

  return (
    <>
      {/* tabs */}
      {view === 'feed' && <FeedTab {...feedProps} />}
      {view === 'sales' && <SalesTab {...salesProps} />}
    </>
  )
}
