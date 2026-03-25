import { ReactNode } from 'react'

import type { Page, Result } from '@/lib/utils/http'
import {
  getDmrktListings,
  getDmrktSales,
  getDmrktNFTs,
} from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'
import { getDmrktListing, getDmrktNFT, getDmrktSale } from '@/lib/dmrkt-indexer/actions/dmrkt.get'

import type { Listing } from '@/domain/listing'
import type { Sale } from '@/domain/sale'
import type { NFT } from '@/domain/nft'
import { activity } from '@/domain/shared/activity'

// shared components
import { ActivityItem, NFTRow } from '@/ui/molecules'

// feature components
import { ListingDetails } from './browse/ui/ListingDetails'
import { SaleDetails } from './browse/ui/SaleDetails'
import { TradeBtn } from './trade/ui/TradeBtn'
import { CreateOrderBtn } from './orders/ui/CreateBidBtn'

export type TabResource = {
  feed: Listing
  explore: NFT
  sales: Sale
}

export type TabName = keyof TabResource

type PageGetters<K extends keyof TabResource> = (args: {
  filters?: Record<string, string[]>
  cursor?: string | null
}) => Promise<Result<Page<TabResource[K]>>>

export const pageGetters: { [K in keyof TabResource]: PageGetters<K> } = {
  feed: getDmrktListings,
  sales: getDmrktSales,
  explore: getDmrktNFTs,
}

export const itemGetters: {
  [K in keyof TabResource]: (id: string) => Promise<Result<TabResource[K]>>
} = {
  feed: getDmrktListing,
  sales: getDmrktSale,
  explore: getDmrktNFT,
}

type TabUIConfig = {
  [K in TabName]: {
    galleryItem: (item: TabResource[K]) => ReactNode
    details: (item: TabResource[K]) => ReactNode
    mainActionBtn: (item: TabResource[K], ctx?: { ownedTokenIds?: bigint[] }) => ReactNode
  }
}

export const tabUIConfig: TabUIConfig = {
  feed: {
    galleryItem: (l: Listing) => <ActivityItem activity={activity.fromListing(l)} />,
    details: (l: Listing) => <ListingDetails listing={l} />,
    mainActionBtn: (l: Listing) => <TradeBtn listing={l} />,
  },

  explore: {
    galleryItem: (n: NFT) => <NFTRow nft={n} />,
    details: () => <div>placeholder</div>,
    mainActionBtn: (n: NFT, ctx) => {
      const owned = ctx?.ownedTokenIds?.includes(n.tokenId)

      return <CreateOrderBtn chainId={n.chainId} collection={n.collection} tokenId={n.tokenId} />
    },
  },

  sales: {
    galleryItem: (s: Sale) => <ActivityItem activity={activity.fromSale(s)} />,
    details: (s: Sale) => <SaleDetails sale={s} />,
    mainActionBtn: () => <button className="btn btn-secondary">view full receipt</button>,
  },
}
