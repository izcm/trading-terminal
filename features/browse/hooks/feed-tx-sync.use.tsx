import { useEffect } from 'react'

import { useTx } from '@/app/providers/TxProvider'
import { Listing } from '@/domain/listing'
import { Page } from '@/lib/utils/http'

/**
 *
 * @param updateFeed function that updates the feed.
 * Receives a function that transforms the current feed into the next feed.
 */
export function useFeedTxSync(updateFeed: (fn: (feed: Page<Listing>) => Page<Listing>) => void) {
  const { txs } = useTx()

  useEffect(() => {
    const filled = txs.filter(tx => tx.status === 'success').map(tx => tx.listingId)

    if (!filled.length) return

    updateFeed(feed => ({
      ...feed, // cursor etc.
      items: feed.items.filter(l => !filled.includes(l.id)), // if filled => filter out
    }))
  }, [txs, updateFeed])
}
