import { ReactNode } from 'react'
import { Plus } from 'lucide-react'

import { DMRKT_INDEXER_BASE_URL as baseUrl } from '@/lib/dmrkt-indexer/constants'
import { NFTCollection, TopNFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
import { Listing } from '@/lib/dmrkt-indexer/types/listing'

import { getDmrktItems } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import { Sale } from '@/domain/sale'

import { ChainActivityProps } from '@/ui/organisms/chain-activity/ChainActivity'

import { ListingRow, SettlementRow, TopCollectionRow } from '@/ui/molecules'
import { Tab, TabUIProps } from '@/ui/organisms/Tab'
import { TradePanel } from '@/features/trade/ui/TradePanel'
import { SalesReceipt } from '@/features/chain-activity/ui/SalesReceipt'
import { MarketplaceView } from '@/features/marketplace/MarketplaceView'

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
          collections,
          initialItems: listingRes.data.items,
          initialCursor: listingRes.data.nextCursor,
        }
      : { collections: [], initialItems: [], initialCursor: null }
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
      ? { initialSales: res.data.items, initialCursor: res.data.nextCursor }
      : { initialSales: [], initialCursor: null }
  }

  /* modes */

  const modes = {
    feed: {
      id: 'feed',
      header: feedMode.header,
      browseItem: feedMode.browseItem,
      sidebar: feedMode.sidebar,
      initialItems: feedProps.initialItems,
      initialCursor: feedProps.initialCursor,
    },

    activity: {
      id: 'activity',
      header: activityMode.header,
      browseItem: activityMode.browseItem,
      sidebar: activityMode.sidebar,
      initialItems: caProps.initialSales,
      initialCursor: caProps.initialCursor,
    },
  } satisfies {
    feed: TabUIProps<Listing>
    activity: TabUIProps<Sale>
  }

  const view = 'feed'
  const mode = modes[view]

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
