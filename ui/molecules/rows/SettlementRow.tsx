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
      <div className="flex gap-2">
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
      <div className="flex-1 flex justify-between font-semibold">
        {sale.nftCollection ? <span>{sale.nftCollection?.symbol}</span> : <span>UNKNOWN</span>}
        <span>{formatEth2(BigInt(sale.price))} ETH</span>
      </div>
    </>
  )
}
