import type { Listing } from '@/domain/listing'

import { tsShort } from '@/lib/utils/time'

import { Details, HexDetailField } from '@/ui/molecules'
import type { DetailField } from '@/ui/molecules/details/DetailFields'
import { listingStatusToClass } from '../lib/listing-status-ui'

const DETAIL_FIELDS: DetailField<Listing>[] = [
  {
    label: 'tokenId',
    getValue: l => (l.isCollectionBid ? 'any' : `#${l.tokenId}`),
  },
  {
    label: 'price',
    getValue: l => `${Number(l.price) / 1e18} ETH`,
  },
  {
    label: 'side',
    getValue: l => l.side,
  },
  {
    label: 'orderHash',
    getValue: l => HexDetailField(l.orderHash),
  },
  {
    label: 'maker',
    getValue: l => HexDetailField(l.actor),
  },
]

const statusField = (l: Listing) => {
  const className = listingStatusToClass[l.status]
  return <span className={className}>{l.status}</span>
}

function getBottomFields(l: Listing): DetailField<Listing>[] | undefined {
  const status: DetailField<Listing> = {
    label: 'status',
    getValue: x => statusField(x),
  }

  if (l.status === 'active') {
    return [status, { label: 'expires', getValue: x => tsShort(x.end) }]
  }

  if (l.status === 'cancelled' || l.status === 'filled') {
    const className =
      l.status === 'filled' ? 'order-filled' : 'text-failure-weak  hover:text-failure'

    return [
      status,
      l.txHash
        ? {
            label: 'txHash',
            getValue: x => HexDetailField(x.txHash!, className),
          }
        : {
            label: 'txHash',
            getValue: () => "couldn't fetch",
            className: `${className} pointer-events-none`, // very sloppy done, don't be this lazy
          },
    ]
  }

  return [status]
}

export const ListingDetails = ({ listing }: { listing: Listing }) => {
  const bottomFields = getBottomFields(listing)

  return (
    <Details<Listing> item={listing} detailsFields={DETAIL_FIELDS} bottomFields={bottomFields} />
  )
}
