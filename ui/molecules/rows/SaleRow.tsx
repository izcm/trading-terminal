'use client'

// todo: decouple here
import { formatEth2 } from '@/lib/blockchain/utils/bigint'

import { tsSuperShort } from '@/domain/shared/utils/time'
import type { Sale } from '@/domain/sale'

type Props = {
  sale: Sale
}

export function SaleRow({ sale }: Props) {
  const isAsk = sale.order?.type === 'ask'
  const isCb = !isAsk && sale.order?.isCollectionBid

  return (
    <>
      {/* Type Badge */}
      <div className="flex gap-4 items-center justify-evenly">
        {sale.order ? (
          <span
            className={`px-2 text-xs font-semibold rounded ${isAsk ? 'text-ask/70' : 'text-bid/70'}`}
          >
            {sale.order?.type.toUpperCase()}
          </span>
        ) : (
          <div className="flex gap-4 items-center text-muted">
            <span className={`text-muted text-xs`}>SALE</span>{' '}
          </div>
        )}
        <span>{tsSuperShort(sale.timestamp)}</span>
      </div>
      <div className="flex-1 flex justify-between font-semibold">
        <span>
          {sale.nftCollection ? <span>{sale.nftCollection?.symbol}</span> : <span>UNKNOWN</span>} #
          {sale.order?.tokenId}
        </span>

        {/* price */}
        <span>{formatEth2(BigInt(sale.price))} ETH</span>
      </div>
    </>
  )
}
