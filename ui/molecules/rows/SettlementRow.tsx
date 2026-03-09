'use client'

// todo: decouple here
import { formatEth2 } from '@/lib/blockchain/utils/bigint'

import { formatTsUTC } from '@/domain/shared/utils/time'
import type { Sale } from '@/domain/sale'

type Props = {
  sale: Sale
}

export function SettlementRow({ sale }: Props) {
  const labelBaseStyle = 'text-xs'
  const isAsk = sale.order?.type === 'ask'

  return (
    <>
      {/* Type Badge */}
      <div className="flex">
        <div className="w-12 flex justify-center"></div>
        {sale.order ? (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${isAsk ? 'text-ask/70' : 'text-bid/70'}`}
          >
            {sale.order?.type.toUpperCase()}
          </span>
        ) : (
          <div className="flex gap-4 items-center text-muted">
            <span className={`text-muted ${labelBaseStyle}`}>SALE</span>{' '}
          </div>
        )}
        <span>{formatTsUTC(sale.timestamp)}</span>
      </div>
      <span>SYMBOL</span>

      {/* <Stat value={sale.buyer as `0x${string}`} label="buyer" fmtFn={shortAddr} />
      <Stat value={sale.seller as `0x${string}`} label="seller" fmtFn={shortAddr} /> */}

      <span>{formatEth2(BigInt(sale.price))} ETH</span>
    </>
  )
}
