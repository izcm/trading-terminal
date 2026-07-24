import { ButtonHTMLAttributes, JSX, ReactNode } from 'react'

import type { Page, Result } from '@/lib/utils/http'
import {
  getDmrktListings,
  getDmrktSettlements,
  getDmrktNFTs,
} from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

import type { Listing } from '@/domain/listing'
import type { Trade } from '@/domain/trade'
import type { NFT } from '@/domain/nft'
import { activity } from '@/domain/shared/activity'
import { getChainConfig } from '@/lib/blockchain/wagmi'

// shared components
import { ActivityRow, NFTRow } from '@/ui/organisms'
import { Ban, CreditCard, FileText, Gavel, Handshake, Slash, Tag, X } from '@/ui/icons'

// feature components
import { ListingDetails } from './marketplace/ui/ListingDetails'
import { TradeDetails } from './marketplace/ui/TradeDetails'
import { capitalize } from '@/lib/utils/string'

// === BASE INFO ===

export type TabResource = {
  orders: Listing
  nfts: NFT
  trades: Trade
}

export type TabName = keyof TabResource

// === ITEM GETTERS ===

type PageGetters<K extends TabName> = (args: {
  filters?: Record<string, string[]>
  cursor?: string | null
  signal?: AbortSignal
}) => Promise<Result<Page<TabResource[K]>>>

export const pageGetters: { [K in TabName]: PageGetters<K> } = {
  orders: getDmrktListings,
  trades: getDmrktSettlements,
  nfts: getDmrktNFTs,
}

// === CTX ===

export type TabCtx = {
  isMine: (item: TabResource[TabName]) => boolean // marks relevant items eg. bids on user's owned tokens and listings made by user
  isMyListing?: (item: Listing) => boolean // only listings made by active user
}

// === ACTION CONFIG ===

export type TabActions = {
  [K in TabName]: (item: TabResource[K], ctx?: TabCtx) => (() => void) | undefined
}

export type ResolvedAction = {
  run: (() => void) | undefined
  disabled: boolean
  loading: boolean
}

// === UI CONFIG ===

export type BtnProps = ButtonHTMLAttributes<HTMLButtonElement>

type TabUIConfig = {
  [K in TabName]: (
    | {
        galleryItem: (item: TabResource[K]) => ReactNode
        galleryItems?: undefined
      }
    | {
        galleryItem?: undefined
        galleryItems: {
          row: (item: TabResource[K]) => ReactNode
          card: (item: TabResource[K]) => ReactNode
        }
      }
  ) & {
    details?: (item: TabResource[K]) => ReactNode
    actionBtnProps?: (item: TabResource[K], disabled?: boolean, ctx?: TabCtx) => BtnProps
  }
}

type IconType = (props: { size?: number }) => JSX.Element

const btnContent = (Icon: IconType, label: string): ReactNode => (
  <div className="flex items-center gap-1">
    <Icon size={16} />
    <span className="px-1">{label}</span>
  </div>
)
export const tabUIConfig: TabUIConfig = {
  orders: {
    galleryItems: {
      row: l => (
        <ActivityRow
          activity={activity.fromListing(l)}
          blockExplorerUrl={getChainConfig(l.chainId)?.blockExplorers?.default?.url}
        />
      ),
      card: l => (
        <ActivityRow
          activity={activity.fromListing(l)}
          detailsPane={<ListingDetails listing={l} />}
          blockExplorerUrl={getChainConfig(l.chainId)?.blockExplorers?.default?.url}
        />
      ),
    },
    details: l => <ListingDetails listing={l} />,
    actionBtnProps: (l, disabled, ctx) => {
      const isCancelAction = ctx?.isMyListing?.(l) && l.status === 'active'

      const content = isCancelAction
        ? { Icon: Ban, label: 'Cancel order' }
        : l.status !== 'active'
          ? { Icon: Slash, label: `${capitalize(l.status)}` }
          : disabled
            ? { Icon: X, label: 'Not fillable' }
            : l.side === 'ask'
              ? { Icon: CreditCard, label: 'Buy loot' }
              : { Icon: Handshake, label: 'Fill bid' }

      return {
        className: isCancelAction ? 'btn btn-danger' : 'btn btn-primary',
        disabled,
        children: btnContent(content.Icon as IconType, content.label),
      }
    },
  },

  nfts: {
    galleryItem: nft => <NFTRow nft={nft} />,
    actionBtnProps: (nft, disabled, ctx) => {
      const isMyToken = ctx?.isMine?.(nft)

      const content = isMyToken
        ? { Icon: Tag, label: 'Sell loot' }
        : { Icon: Gavel, label: 'Make offer' }

      return {
        className: 'btn btn-primary',
        disabled,
        children: btnContent(content.Icon as IconType, content.label),
      }
    },
  },

  trades: {
    galleryItems: {
      row: s => (
        <ActivityRow
          activity={activity.fromTrade(s)}
          blockExplorerUrl={getChainConfig(s.chainId)?.blockExplorers?.default?.url}
        />
      ),
      card: s => (
        <ActivityRow
          activity={activity.fromTrade(s)}
          detailsPane={<TradeDetails trade={s} />}
          blockExplorerUrl={getChainConfig(s.chainId)?.blockExplorers?.default?.url}
        />
      ),
    },
    details: s => <TradeDetails trade={s} />,
    actionBtnProps: () => ({
      className: 'btn btn-secondary',
      children: btnContent(FileText as IconType, 'Tx details'),
    }),
  },
}
