import type { Trade } from '@/domain/trade'
import { tsShort } from '@/lib/utils/time'

import { Details, HexDetailField } from '@/ui/molecules'
import type { DetailField } from '@/ui/molecules/details/DetailFields'

const DETAIL_FIELDS: DetailField<Trade>[] = [
  {
    label: 'tokenId',
    getValue: s => `#${s.tokenId}`,
  },
  {
    label: 'price',
    getValue: s => `${Number(s.price) / 1e18} ETH`,
  },
  {
    label: 'txHash',
    getValue: s => HexDetailField(s.txHash),
  },
  {
    label: 'orderHash',
    getValue: s => HexDetailField(s.orderHash),
  },
  {
    label: 'buyer',
    getValue: s => HexDetailField(s.buyer),
  },
  {
    label: 'seller',
    getValue: s => HexDetailField(s.seller),
  },
]

const BOTTOM_FIELDS: DetailField<Trade>[] = [
  {
    label: 'timestamp',
    getValue: s => tsShort(s.timestamp),
  },
]

// const TITLE_FIELD: DetailField<Trade> = {
//   label: 'collection',
//   getValue: s => (s.nftCollection ? s.nftCollection.name : s.collection),
// }

export const TradeDetails = ({ trade }: { trade: Trade }) => (
  <Details<Trade>
    item={trade}
    // title={{ field: TITLE_FIELD, badge: { type: trade.order ? trade.order.type : 'unknown' } }}
    detailsFields={DETAIL_FIELDS}
    bottomFields={BOTTOM_FIELDS}
  />
)
