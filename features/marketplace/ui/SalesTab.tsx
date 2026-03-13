import { useMemo } from 'react'

import { getDmrktSales } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import { formatEth2 } from '@/lib/blockchain/utils/bigint'

import { Chart } from '@/features/sales/ui/Charts'
import { SaleDetails } from '@/features/sales/ui/SaleDetails'

import type { Sale } from '@/domain/sale'
import { activity } from '@/domain/shared/types/activity'
import { aggregateSales } from '@/domain/shared/utils/analyze'

import { Tab, TabUIProps, NFTPreview } from '@/ui/organisms'
import { ActivityItem } from '@/ui/molecules'

export type SalesProps = {
  initialItems: Sale[]
  initialCursor: string | null
}

const mode: Omit<TabUIProps<Sale>, 'secondaryView'> = {
  getGalleryItems: getDmrktSales,
  galleryItem: item => <ActivityItem activity={activity.fromSale(item)} />,
  sidePanel: item => {
    return (
      <div className="flex flex-col gap-2 h-full">
        <div className="pointer-events-none">
          {item && (
            <NFTPreview chainId={item.chainId} address={item.collection} tokenId={item.tokenId} />
          )}
        </div>
        <div className="flex flex-col gap-2 my-1">
          <button className="btn btn btn-ghost">open receipt 2.0</button>
          <span className="text-xs text-muted">gas costs, tx inputs etc.</span>
        </div>
        <div className="flex-1 card bg-secondary">
          <SaleDetails sale={item} />
        </div>
      </div>
    )
  },
}

export function SalesTab({ initialItems, initialCursor }: SalesProps) {
  return (
    <>
      <Tab<Sale>
        getGalleryItems={getDmrktSales}
        galleryItem={mode.galleryItem}
        sidePanel={mode.sidePanel}
        initialItems={initialItems}
        initialCursor={initialCursor}
      />
    </>
  )
}
