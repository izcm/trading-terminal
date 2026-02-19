import { Sale } from '@/domain/types'
import { formatEth2 } from '@/lib/utils/format'

type Props = {
  sale: Sale
}

export function SalesReceipt({ sale }: Props) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between border-b border-default pb-3">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs text-stat/80">{sale.order?.side ?? 'SALE'}</span>

          <span className="text-lg font-semibold">{formatEth2(BigInt(sale.price))} ETH</span>
        </div>
      </div>

      {/* Body */}
      <div className="mt-4 flex flex-col gap-5 text-sm text-left">
        {/* Parties */}
        <section className="flex flex-col gap-2">
          <span className="font-medium">Parties</span>

          <Row label="Seller" value={sale.seller} />
          <Row label="Buyer" value={sale.buyer} />

          {sale.order?.signer && <Row label="Signer" value={sale.order.signer} />}
        </section>

        {/* Execution */}
        <section className="flex flex-col gap-2">
          <span className="font-medium">Execution</span>

          <Row label="Chain" value={sale.chainId} />
          <Row label="Block" value={sale.execution.block.number} />
          <Row label="Timestamp" value={sale.execution.block.timestamp} />
          <Row label="Tx" value={sale.execution.tx.hash} mono />

          {sale.execution.tx.ctx?.function && (
            <Row
              label="Function"
              value={`${sale.execution.tx.ctx.function.name}::${sale.execution.tx.ctx?.function.selector}`}
            />
          )}
        </section>
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className={`max-w-[220px] truncate ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}
