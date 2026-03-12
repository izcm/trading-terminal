import type { Listing } from '@/domain/listing'

import { addrShort } from '@/domain/shared/utils/fmt/hex'
import { tsShort } from '@/domain/shared/utils/time'

import { Details } from '@/ui/organisms/Details'
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
    label: 'seller',
    getValue: l => addrShort(l.actor),
  },
]

const TITLE_FIELD: DetailField<Listing> = {
  label: 'collection',
  getValue: l => (l.nftCollection ? l.nftCollection.name : l.collection),
}

const TIMING_FIELDS: DetailField<Listing>[] = [
  { label: 'starts', getValue: l => tsShort(l.start) },
  { label: 'expires', getValue: l => tsShort(l.end) },
]

export const ListingDetails = ({ listing }: { listing: Listing }) => (
  <Details<Listing>
    item={listing}
    title={{ field: TITLE_FIELD, badge: { type: listing.type } }}
    detailsFields={DETAIL_FIELDS}
    timingFields={TIMING_FIELDS}
  />
)
