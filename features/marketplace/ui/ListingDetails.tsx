import type { Listing } from '@/domain/listing'

import { tsShort } from '@/domain/shared/utils/time'

import { Details, HexDetailField } from '@/ui/organisms/Details'
import type { DetailField } from '@/ui/molecules/DetailFields'

const DETAIL_FIELDS: DetailField<Listing>[] = [
  {
    label: 'token id',
    getValue: l => (l.isCollectionBid ? 'any' : `#${l.tokenId}`),
  },
  {
    label: 'price',
    getValue: l => `${Number(l.price) / 1e18} ETH`,
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

const TIMING_FIELDS: DetailField<Listing>[] = [
  { label: 'starts', getValue: l => tsShort(l.start) },
  { label: 'expires', getValue: l => tsShort(l.end) },
]

export const ListingDetails = ({ listing }: { listing: Listing }) => (
  <Details<Listing> item={listing} detailsFields={DETAIL_FIELDS} timingFields={TIMING_FIELDS} />
)
