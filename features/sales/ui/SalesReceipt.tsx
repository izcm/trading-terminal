import type { Sale } from '@/domain/sale'

type Props = {
  sale: Sale
}

export function SalesReceipt({ sale }: Props) {
  return (
    <div>
      {/* Body */}
      <div className="mt-4 flex flex-col gap-5 text-sm text-left">
        {/* Parties */}
        <section className="flex flex-col gap-2">
          <span className="font-medium">Parties</span>

          <Row label="Seller" value={sale.seller} />
          <Row label="Buyer" value={sale.buyer} />
        </section>

        {/* Execution */}
        <section className="flex flex-col gap-2">
          <span className="font-medium">Execution</span>

          <Row label="Chain" value={sale.chainId} />
          <Row label="Block" value={sale.blockNumber} />
          <Row label="Timestamp" value={sale.timestamp} />
          <Row label="Tx" value={sale.txHash} mono />
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
