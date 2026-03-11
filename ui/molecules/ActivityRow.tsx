// todo: decouple
import { formatEth2 } from '@/lib/blockchain/utils/bigint'

import { Activity } from '@/domain/shared/types/activity'
import { tsSuperShort } from '@/domain/shared/utils/time'

export function ActivityRow({ activity }: { activity: Activity }) {
  const { activityType, isCollectionBid, timestamp, collection, tokenId, price } = activity

  return (
    <>
      {/* Type Badge */}
      <div className="flex items-center justify-center gap-4 ">
        <span
          className={`px-2 text-center text-xs font-semibold rounded ${activityType === 'ask' ? 'text-ask/70' : 'text-bid/70'}`}
        >
          {activityType.toUpperCase()}
        </span>
        <span>{tsSuperShort(timestamp)}</span>
      </div>
      <div className="flex-1 flex justify-between">
        {/* token info */}
        <div className="flex flex-col">
          <span className="font-semibold flex items-center gap-1">
            {collection}{' '}
            {isCollectionBid ? (
              <>
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded bg-accent/10 text-accent"
                  title="Collection bid"
                >
                  <svg viewBox="0 0 16 16" className="w-3 h-3">
                    <rect
                      x="1.5"
                      y="5.5"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="6.5"
                      y="2.5"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </>
            ) : (
              <>#{tokenId}</>
            )}
          </span>
        </div>

        {/* price */}
        <span className="flex font-semibold">{formatEth2(BigInt(price))} ETH</span>
      </div>
    </>
  )
}
