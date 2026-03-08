'use client'

import type { ReactNode } from 'react'

import type { Listing } from '@/lib/dmrkt-indexer/types/listing'
import { ListingRow } from '@/components/molecules'

import { Tab } from './Tab'
import { TradePanel } from './trade/TradePanel'

type Props = {
  header: ReactNode
  initialItems: Listing[]
  initialCursor: string | null
}

export function Feed({ header, initialItems, initialCursor }: Props) {
  return (
    <Tab<Listing>
      header={header}
      sidebar={({ item }) => <TradePanel listing={item} />}
      browseItem={({ item }) => <ListingRow listing={item} />}
      initialItems={initialItems}
      initialCursor={initialCursor}
    />
  )
}
