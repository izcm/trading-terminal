'use client'

import type { Sale } from '@/domain/sale'
import { DetailFields, type DetailField } from '@/components/molecules/DetailFields'

type Props = {
  sale: Sale | null
}

const PARTY_FIELDS: DetailField<Sale>[] = [
  { label: 'Seller', getValue: s => s.seller },
  { label: 'Buyer', getValue: s => s.buyer },
]

const EXEC_FIELDS: DetailField<Sale>[] = [
  { label: 'Chain', getValue: s => s.chainId },
  { label: 'Block', getValue: s => s.blockNumber },
  { label: 'Tx', getValue: s => s.txHash, className: 'font-mono text-xs' },
]

export function SaleDetails({ sale }: Props) {
  if (!sale) {
    return <div className="card h-full p-4 text-sm">select a sale</div>
  }

  return (
    <div className="flex flex-col card h-full gap-6 p-4 text-sm">
      <div className="flex flex-col gap-1">
        <span className="font-medium">Parties</span>
        <DetailFields data={sale} fields={PARTY_FIELDS} />
      </div>

      <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
        <span className="font-medium">Execution</span>
        <DetailFields data={sale} fields={EXEC_FIELDS} />
      </div>
    </div>
  )
}
