import { addrShort, truncateHex } from '@/domain/shared/utils/fmt/hex'

import { Sale } from '@/domain/sale'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xs font-mono text-right">{value}</span>
    </div>
  )
}

export function SalesReceipt({ sale }: { sale: Sale }) {
  const ctx = sale.txContext

  return (
    <div className="card p-5 w-full max-w-[480px] space-y-4">
      {/* header */}
      <div className="flex gap-4 justify-between items-center">
        <h2 className="text-sm font-semibold">Transaction</h2>
        <span className="text-xs text-muted">#{`${sale.chainId}:${truncateHex(sale.txHash)}`}</span>
      </div>

      {/* divider */}
      <div className="border-t border-soft" />

      {/* tx info */}
      <div className="space-y-1">
        <Row label="tx hash" value={truncateHex(sale.txHash)} />
        <Row label="block" value={sale.blockNumber} />
        <Row label="log index" value={sale.logIndex} />
      </div>

      {/* call */}
      {ctx && (
        <>
          <div className="border-t border-soft pt-3 space-y-1">
            <Row
              label="contract"
              value={<span className="text-accent">{addrShort(ctx.contractAddress)}</span>}
            />

            <Row
              label="function"
              value={
                <span className="text-accent">
                  {ctx.functionName}:{ctx.functionSelector}
                </span>
              }
            />

            <Row label="tx index" value={ctx.txIndex} />
          </div>

          {/* gas */}
          <div className="border-t border-soft pt-3 space-y-1">
            <Row label="gas used" value={ctx.gasUsed.toString()} />

            <Row label="gas price" value={`${Number(ctx.gasPrice) / 1e9} gwei`} />

            <Row
              label="tx cost"
              value={`${Number(BigInt(ctx.gasUsed) * BigInt(ctx.gasPrice)) / 1e9} gwei`}
            />
          </div>
        </>
      )}
    </div>
  )
}
