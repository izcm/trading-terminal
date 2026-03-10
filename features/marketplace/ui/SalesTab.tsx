import { useMemo } from 'react'

import { getDmrktSales } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { Chart } from '@/features/sales/ui/Charts'
import { SaleDetails } from '@/features/sales/ui/SaleDetails'

import { Sale } from '@/domain/sale'
import { aggregateSales } from '@/domain/shared/utils/analyze'

import { Tab, TabUIProps, NFTSummary } from '@/ui/organisms'
import { SaleRow } from '@/ui/molecules'
import { Details } from '@/ui/organisms/Details'

export type SalesProps = {
  initialItems: Sale[]
  initialCursor: string | null
}

function makeAnalyticsArea(sales: Sale[]) {
  const analytics = useMemo(() => {
    return aggregateSales(sales, 'day')
  }, [sales])

  const totalVolume = sales.reduce((sum, sale) => sum + BigInt(sale.price), 0n)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-evenly card p-2">
        <span>
          sales <strong>{sales.length}</strong>
        </span>
        <span>
          users <strong>{Array.from(analytics.byActor).length}</strong>
        </span>

        <span>
          volume <strong>{totalVolume}</strong>
        </span>
      </div>
      <div className="card pt-2 w-full grow-0">
        <Chart analytics={analytics} sales={sales} timeUnit={'day'} />
      </div>
    </div>
  )
}

const mode: Omit<TabUIProps<Sale>, 'secondaryView'> = {
  getGalleryItems: getDmrktSales,
  galleryItem: item => <SaleRow sale={item} />,
  sidePanel: item => {
    return (
      <div className="flex flex-col gap-2 h-full">
        <div className="card">
          {item && (
            <NFTSummary chainId={item.chainId} address={item.collection} tokenId={item.tokenId} />
          )}
        </div>
        <div className="flex flex-col gap-2 my-1">
          <button className="btn btn-ghost">open receipt 2.0</button>
          <span className="text-xs text-muted">gas costs, tx inputs etc.</span>
        </div>
        <SaleDetails sale={item} />
      </div>
    )
  },
}

export function SalesTab({ initialItems, initialCursor }: SalesProps) {
  return (
    <>
      <Tab<Sale>
        secondaryView={makeAnalyticsArea}
        getGalleryItems={getDmrktSales}
        galleryItem={mode.galleryItem}
        sidePanel={mode.sidePanel}
        initialItems={initialItems}
        initialCursor={initialCursor}
      />
    </>
  )
}
