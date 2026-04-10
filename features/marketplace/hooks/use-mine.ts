import { useCallback, useEffect, useRef } from 'react'

import { Hex } from '@/domain/shared/eth'
import { TabName, TabResource } from '@/features/tab-config'
import { Listing } from '@/domain/listing'

// rules per tab for marking a domain item as "mine"
export function useMine(tab: TabName, account: Hex | undefined, ids: bigint[]) {
  // normalize tokenIds
  const ownedIdsRef = useRef<string[]>([])

  useEffect(() => {
    ownedIdsRef.current = ids.map(id => id.toString())
  }, [ids])

  // my tokens
  const isMyToken = useCallback(
    (item: TabResource[TabName]) => {
      if (!account) return false
      return ids.includes(item.tokenId)
    },
    [account, ids]
  )

  function isListing(item: TabResource[TabName]): item is Listing {
    return 'actor' in item
  }

  // helps decide whether to show cancel btn
  const isMyListing = useCallback(
    (item: TabResource[TabName]) => {
      if (!account || tab !== 'feed') return false
      if (!isListing(item)) return false

      return item.actor === account
    },
    [tab, account]
  )

  const buildMineQuery = useCallback(
    (filters: Record<string, string[]>) => {
      if (!account) return filters

      const mineFilters: Record<TabName, object> = {
        feed: { ['or.tokenId']: ownedIdsRef.current, ['or.side']: ['0'] }, // is of type ask or owned by user
        sales: { ['or.buyer']: [account], ['or.seller']: [account] }, // is buyer or seller
        explore: { tokenId: ownedIdsRef.current }, // is owned by user
      }

      return {
        ...filters,
        ...mineFilters[tab],
      }
    },
    [account, tab]
  )

  return { buildMineQuery, isMyToken, isMyListing }
}
