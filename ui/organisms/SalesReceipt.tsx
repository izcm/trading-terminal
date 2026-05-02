import { addrShort, truncateHex } from '@/lib/utils/hex'

import type { Sale } from '@/domain/sale'
import { Copyable } from '../atoms'

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-mono text-right">{value}</span>
    </div>
  )
}

const Divider = () => <div className="border-t border-soft" />

const shortMoney = (x: number) => x.toFixed(6)

export function SalesReceipt({ sale }: { sale: Sale }) {
  const ctx = sale.txContext

  return (
    <div className="flex flex-col gap-4 rounded-border p-6">
      {/* header */}
      <div className="flex gap-4 justify-between items-center">
        <h2 className="text-sm font-semibold">Transaction</h2>
        <span className="text-sm text-muted">#{`${sale.chainId}:${truncateHex(sale.txHash)}`}</span>
      </div>

      <Divider />

      {/* tx info */}
      <div className="flex flex-col gap-1">
        <Row label="chain id" value={sale.chainId} />
        <Row
          label="tx hash"
          value={<Copyable value={sale.txHash}>{truncateHex(sale.txHash)}</Copyable>}
        />
        <Row label="block" value={sale.blockNumber} />
      </div>

      {/* call */}
      {ctx ? (
        <>
          <Divider />

          <div className="flex flex-col gap-1">
            <Row
              label="contract"
              value={
                <Copyable value={ctx.contractAddress}>{addrShort(ctx.contractAddress)}</Copyable>
              }
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

          <Divider />

          {/* gas */}

          <div className="flex flex-col gap-1">
            <Row label="gas used" value={ctx.gasUsed.toString()} />

            <Row label="gas price" value={`${shortMoney(Number(ctx.gasPrice) / 1e9)} gwei`} />

            <Row
              label="tx cost"
              value={`${shortMoney(Number(BigInt(ctx.gasUsed) * BigInt(ctx.gasPrice)) / 1e9)} gwei`}
            />
          </div>
        </>
      ) : (
        <>
          <Divider />
          <div className="flex flex-col gap-2">
            <span className="text-sm text-muted">more info is coming...</span>
            <span className="text-sm text-muted">usually a couple minutes</span>
          </div>
        </>
      )}
    </div>
  )
}
