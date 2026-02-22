'use client'

import { Sale } from '@/domain/types/sale'
import { formatEth2, formatTsUTC, shortAddr } from '@/lib/utils/format'
import { Stat } from '../Stat'

type Props = {
  sale: Sale
  onSelect: (sale: Sale) => void
}

export function SettlementRow({ sale, onSelect }: Props) {
  const { block } = sale.execution

  return (
    <li onClick={() => onSelect(sale)}>
      <button className="stat-row text-muted w-full">
        <div className="flex gap-4 items-center">
          <span
            className={sale.order?.side === 'ASK' ? 'text-ask/70 text-xs' : 'text-bid/70 text-xs'}
          >
            {sale.order?.side.slice(0, 1)}
          </span>
          <span>{formatTsUTC(block.timestamp)}</span>
        </div>

        <span>SYMBOL</span>

        <Stat value={sale.buyer} label="buyer" fmtFn={shortAddr} />
        <Stat value={sale.seller} label="seller" fmtFn={shortAddr} />

        <span>{formatEth2(BigInt(sale.price))} ETH</span>
      </button>
    </li>
  )
}
