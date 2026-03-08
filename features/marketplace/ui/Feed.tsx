// todo: have these imported in centralized place (don't depend on lucide-react)
import { Plus } from 'lucide-react'

import { Tab, TabUIProps } from '@/components/organisms/Tab'
import { Listing } from '@/lib/dmrkt-indexer/types/listing'
import { ListingRow } from '@/components/molecules'
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

export function Feed() {
  return <Tab header={mode.header} />
}
