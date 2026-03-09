import { getDmrktSales } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { Sale } from '@/domain/sale'

import { SettlementRow } from '@/ui/molecules'
import { Tab, TabUIProps } from '@/ui/organisms/core/Tab'
import { NFTSummary } from '@/ui/organisms/NFTSummary'
import { SalesReceipt } from '@/features/sales/ui/SalesReceipt'

export type SalesProps = {
  initialItems: Sale[]
  initialCursor: string | null
}

const mode: Omit<TabUIProps<Sale>, 'secondaryView'> = {
  getGalleryItems: getDmrktSales,
  galleryItem: item => <SettlementRow sale={item} />,
  sidePanel: item => {
    return (
      <div className="flex flex-col gap-4 basis-1/4 h-full">
        <div className="h-1/3 card">
          {item && (
            <NFTSummary
              chainId={item?.chainId}
              address={item?.collection}
              tokenId={item?.tokenId}
            />
          )}
        </div>
        <div className="h-full card">
          <SalesReceipt sale={item} />
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
