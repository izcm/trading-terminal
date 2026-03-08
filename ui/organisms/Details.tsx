'use client'

import type { Sale } from '@/domain/sale'

type Props = {
  sale: Sale | null
}

type DetailField = {
  label: string
  getValue: (sale: Sale) => string | number
  className?: string
}

const PARTY_FIELDS: DetailField[] = [
  {
    label: 'Seller',
    getValue: sale => sale.seller,
  },
  {
    label: 'Buyer',
    getValue: sale => sale.buyer,
  },
]

const EXECUTION_FIELDS: DetailField[] = [
  {
    label: 'Chain',
    getValue: sale => sale.chainId,
  },
  {
    label: 'Block',
    getValue: sale => sale.blockNumber,
  },
  {
    label: 'Timestamp',
    getValue: sale => sale.timestamp,
  },
  {
    label: 'Tx',
    getValue: sale => sale.txHash,
    className: 'font-mono text-xs',
  },
]

function DetailRow({
  label,
  value,
  className,
}: {
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-500">{label}</span>
      <span className={className}>{value}</span>
    </div>
  )
}

export function ListingDetails({ sale }: Props) {
  // nothing selected yet
  if (!sale) {
    return <div className="card h-full p-4 text-sm">select a listing ✨</div>
  }

  const collection = sale.nftCollection?.name ?? 'unknown collection'
  const type = sale.listing?.type?.toUpperCase() ?? 'SALE'

  return (
    <div
      className="flex flex-col card h-full gap-6 p-4 text-sm"
      tabIndex={-1} // important later for keyboard focus
    >
      {/* title */}
      <div className="flex justify-between text-start">
        <div className="flex flex-col">
          <span className="text-xs">collection</span>
          <span className="font-medium">{collection}</span>
        </div>

        <span
          className={`text-xs font-semibold px-2 py-1 rounded
            ${sale.listing?.type === 'ask' ? 'bg-ask/10 text-ask' : 'bg-bid/10 text-bid'}`}
        >
          {type}
        </span>
      </div>

      {/* details */}
      <div className="flex flex-col gap-1">
        <span className="font-medium">Parties</span>

        {PARTY_FIELDS.map(field => (
          <DetailRow
            key={field.label}
            label={field.label}
            value={field.getValue(sale)}
            className={field.className}
          />
        ))}
      </div>

      {/* execution */}
      <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
        <span className="font-medium">Execution</span>

        {EXECUTION_FIELDS.map(field => (
          <DetailRow
            key={field.label}
            label={field.label}
            value={field.getValue(sale)}
            className={field.className}
          />
        ))}
      </div>
    </div>
  )
}
