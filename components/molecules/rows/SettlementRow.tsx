'use client'

import type { Sale } from '@/domain/sale'
import { formatEth2, formatTsUTC, shortAddr } from '@/lib/utils/format'
import { Stat } from '../Stat'

type Props = {
  sale: Sale
}

export function SettlementRow({ sale }: Props) {
  const labelBaseStyle = 'text-xs'
  return (
    <>
      <div className="flex gap-4 items-center text-muted">
        <span className={`text-muted ${labelBaseStyle}`}>SALE</span>
        <span>{formatTsUTC(sale.timestamp)}</span>
      </div>

      <span>SYMBOL</span>

      <Stat value={sale.buyer as `0x${string}`} label="buyer" fmtFn={shortAddr} />
      <Stat value={sale.seller as `0x${string}`} label="seller" fmtFn={shortAddr} />

      <span>{formatEth2(BigInt(sale.price))} ETH</span>
    </>
  )
}
