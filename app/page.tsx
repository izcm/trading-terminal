import { ReactNode } from 'react'
import { Plus } from 'lucide-react'

// todo: decouple
import { DMRKT_INDEXER_BASE_URL as baseUrl } from '@/lib/dmrkt-indexer/constants'
import { TopNFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
import { Listing } from '@/lib/dmrkt-indexer/types/listing'
import { getDmrktItems } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { TradePanel } from '@/features/trade/ui/TradePanel'
import { SalesReceipt } from '@/features/sales/ui/SalesReceipt'
import { MarketplaceView } from '@/features/marketplace/ui/MarketplaceView'

import { ChainActivityProps } from '@/ui/organisms/chain-activity/ChainActivity'

import { ListingRow, SettlementRow, TopCollectionRow } from '@/ui/molecules'

import { Sale } from '@/domain/sale'

type ModeConfig<T> = {
  id: string
  header: ReactNode
  browseItem: (item: T) => ReactNode
  sidebar: (item: T) => ReactNode
}

const feedMode: ModeConfig<Listing> = {
  id: 'feed',

  header: (
    <button className="btn btn-secondary self-end">
      <Plus /> create order
    </button>
  ),

  browseItem: item => <ListingRow listing={item} />,
  sidebar: item => <TradePanel listing={item} />,
}

const activityMode: ModeConfig<Sale> = {
  id: 'activity',

  header: <div>hello</div>,

  browseItem: item => <SettlementRow sale={item} />,
  sidebar: item => <SalesReceipt sale={item} />,
}

export default async function Page() {
  /* feed */

  let feedProps

  {
    let colRes = await fetch(`${baseUrl}/api/nft-collections/top?chainId=31337&limit=3`, {
      cache: 'no-store',
    })

    const collections = (await colRes.json()) as TopNFTCollection[]

    const listingRes = await getDmrktItems<Listing>(
      'orders',
      'limit=25&status=active&include=nftCollection',
      null
    )

    feedProps = listingRes.ok
      ? {
          initialItems: {
            listings: listingRes.data.initialItems,
            topCollections: collections,
          },
          initialCursor: listingRes.data.initialCursor,
        }
      : { initialItems: { listings: [], topCollections: [] }, initialCursor: null }
  }

  /* chain activity */

  let caProps: ChainActivityProps

  {
    const res = await getDmrktItems<Sale>(
      'settlements',
      'limit=25&include=nftCollection&include=order',
      null
    )

    caProps = res.ok
      ? { initialSales: res.data.initialItems, initialCursor: res.data.initialCursor }
      : { initialSales: [], initialCursor: null }
  }

  /* modes */

  // const modes = {
  //   activity: {
  //     id: 'activity',
  //     header: activityMode.header,
  //     browseItem: activityMode.browseItem,
  //     sidebar: activityMode.sidebar,
  //     initialItems: caProps.initialSales,
  //     initialCursor: caProps.initialCursor,
  //   },
  // } satisfies {
  //   feed: TabUIProps<Listing>
  //   activity: TabUIProps<Sale>
  // }

  return (
    // <Tab
    //   id={mode.id}
    //   header={mode.header}
    //   browseItem={mode.browseItem}
    //   sidebar={mode.sidebar}
    //   initialItems={mode.initialItems}
    //   initialCursor={mode.initialCursor}
    // />
    <MarketplaceView feedProps={feedProps} activityProps={caProps} />
  )
}
