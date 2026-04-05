import type { Sale } from '@/domain/sale'
import { tsShort } from '@/domain/shared/utils/time'

import { Details, HexDetailField } from '@/ui/organisms'
import type { DetailField } from '@/ui/molecules/DetailFields'

const DETAIL_FIELDS: DetailField<Sale>[] = [
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

const BOTTOM_FIELDS: DetailField<Sale>[] = [
  {
    label: 'timestamp',
    getValue: s => tsShort(s.timestamp),
  },
]

// const TITLE_FIELD: DetailField<Sale> = {
//   label: 'collection',
//   getValue: s => (s.nftCollection ? s.nftCollection.name : s.collection),
// }

export const SaleDetails = ({ sale }: { sale: Sale }) => (
  <Details<Sale>
    item={sale}
    // title={{ field: TITLE_FIELD, badge: { type: sale.order ? sale.order.type : 'unknown' } }}
    detailsFields={DETAIL_FIELDS}
    bottomFields={BOTTOM_FIELDS}
  />
)
