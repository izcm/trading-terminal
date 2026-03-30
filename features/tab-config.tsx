import { ReactNode } from 'react'

import { OrderSide } from '@/protocol/eip712'
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
import { ListingDetails } from './marketplace/ui/ListingDetails'
import { SaleDetails } from './marketplace/ui/SaleDetails'
import { TradeBtn } from './trade/ui/TradeBtn'
import { CreateOrderBtn } from './orders/ui/CreateOrderBtn'
import { ReceiptBtn } from './marketplace/ui/ReceiptBtn'
import { CancelOrderBtn } from './orders/ui/CancelOrderBtn'

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

export type TabCtx<K extends TabName> = {
  isMyToken?: (item: TabResource[K]) => boolean // all items have tokenId
  isMyListing?: (item: Listing) => boolean
}

type TabUIConfig = {
  [K in TabName]: {
    galleryItem: (item: TabResource[K]) => ReactNode
    details?: (item: TabResource[K]) => ReactNode
    mainActionBtn: (item: TabResource[K], ctx?: TabCtx<K>) => ReactNode
  }
}

export const tabUIConfig: TabUIConfig = {
  feed: {
    galleryItem: (l: Listing) => <ActivityItem activity={activity.fromListing(l)} />,
    details: (l: Listing) => <ListingDetails listing={l} />,
    mainActionBtn: (l: Listing, ctx) => {
      // if isMine (token) && listing is ask => cancelBtn
      // if isMine (token) && listing is bid => fillBid (tradeBtn)
      if (ctx?.isMyListing?.(l) && l.status === 'active')
        return <CancelOrderBtn nonce={BigInt(l.rawOrder.nonce)} listingId={l.id} />
      return <TradeBtn listing={l} />
    },
  },

  explore: {
    galleryItem: (n: NFT) => <NFTRow nft={n} />,
    mainActionBtn: (n: NFT, ctx) => {
      const owned = ctx?.isMyToken?.(n)

      let side

      const btnProps = {
        collection: n.collection,
        tokenId: n.tokenId,
      }

      if (owned) {
        side = OrderSide.ASK
      } else {
        side = OrderSide.BID
      }

      return <CreateOrderBtn side={side} {...btnProps} />
    },
  },

  sales: {
    galleryItem: (s: Sale) => <ActivityItem activity={activity.fromSale(s)} />,
    details: (s: Sale) => <SaleDetails sale={s} />,
    mainActionBtn: (s: Sale) => <ReceiptBtn sale={s} />,
  },
}
