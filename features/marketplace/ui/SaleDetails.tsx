import type { Sale } from '@/domain/sale'
import { addrShort, truncateHex } from '@/domain/shared/utils/fmt/hex'
import { tsShort } from '@/domain/shared/utils/time'

import { Details, HexDetailField } from '@/ui/organisms/Details'
import type { DetailField } from '@/ui/molecules/DetailFields'
import { Copyable } from '@/ui/atoms/Copypable'

const DETAIL_FIELDS: DetailField<Sale>[] = [
  {
    label: 'chain',
    getValue: s => s.chainId,
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
    label: 'tx hash',
    getValue: s => HexDetailField(s.txHash),
  },
  {
    label: 'block number',
    getValue: s => s.blockNumber,
  },
]

const TIMING_FIELDS: DetailField<Sale>[] = [
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
    timingFields={TIMING_FIELDS}
  />
)
