import { useCallback, useEffect, useRef } from 'react'

import { Hex } from '@/domain/shared/eth'
import { Listing } from '@/domain/listing'
import { Sale } from '@/domain/sale'

import { TabName, TabResource } from '@/features/tab-config'

// rules per tab for marking a domain item as "mine"
export function useMine(tab: TabName, account: Hex | undefined, ids: bigint[]) {
  const ownedIdsRef = useRef<bigint[]>(ids)

  useEffect(() => {
    ownedIdsRef.current = ids
  }, [ids])

  type HasActor = { actor: Hex }

  const isMyListing = useCallback(
    (item: HasActor) => {
      if (!account) return false
      return item.actor === account
    },
    [account]
  )

  const isMine = useCallback(
    (item: TabResource[TabName]) => {
      switch (tab) {
        case 'feed':
          return (item as Listing).actor === account || ownedIdsRef.current.includes(item.tokenId)
        case 'explore':
          return ownedIdsRef.current.includes(item.tokenId)
        case 'sales':
          return (item as Sale).seller === account || (item as Sale).buyer === account
        default:
          return false
      }
    },
    [account, tab]
  )

  const buildMineQuery = useCallback(
    (filters: Record<string, string[]>) => {
      if (!account) return filters

      const ownedIds = ownedIdsRef.current.map(id => id.toString())

      const mineFilters: Record<TabName, Record<string, string[]>> = {
        feed: { 'or.tokenId': ownedIds, ['or.side']: ['0'] }, // is of type ask or owned by user
        sales: { 'or.buyer': [account], ['or.seller']: [account] }, // is buyer or seller
        explore: { tokenId: ownedIds }, // is owned by user
      }

      return {
        ...filters,
        ...mineFilters[tab],
      }
    },
    [account, tab]
  )

  return { buildMineQuery, isMine, isMyListing }
}
