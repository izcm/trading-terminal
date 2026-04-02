import type { Sale } from '@/domain/sale'
import { tsShort } from '@/domain/shared/utils/time'

import { Details, HexDetailField } from '@/ui/organisms/Details'
import type { DetailField } from '@/ui/molecules/DetailFields'

const DETAIL_FIELDS: DetailField<Sale>[] = [
  {
    label: 'chainId',
    getValue: s => s.chainId,
  },
  {
    label: 'txHash',
    getValue: s => HexDetailField(s.txHash),
  },
  {
    label: 'buyer',
    getValue: s => HexDetailField(s.buyer),
  },
  {
    label: 'seller',
    getValue: s => HexDetailField(s.seller),
  },
  {
    label: 'blockNumber',
    getValue: s => s.blockNumber,
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
