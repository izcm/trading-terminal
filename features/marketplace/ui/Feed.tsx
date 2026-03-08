// todo: have these imported in centralized place (don't depend on lucide-react)
import { Plus } from 'lucide-react'

import { Tab, TabUIProps } from '@/ui/organisms/core/Tab'
import { Listing } from '@/lib/dmrkt-indexer/types/listing'
import { ListingRow } from '@/ui/molecules'
import { TradePanel } from '@/features/trade/ui/TradePanel'

const mode: TabUIProps<Listing> = {
  header: (
    <button className="btn btn-secondary self-end">
      <Plus /> create order
    </button>
  ),

  browseItem: item => <ListingRow listing={item} />,
  sidebar: item => <TradePanel listing={item} />,
}

export type FeedProps = {
  items: Listing[]
  nextCursor: string | null
}

export function Feed({ items, nextCursor }: FeedProps) {
  return <Tab header={mode.header} browseItem={mode.browseItem} sidebar={mode.sidebar} items={} />
}
