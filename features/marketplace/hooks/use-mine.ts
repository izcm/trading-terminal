import { useCallback, useMemo } from 'react'

import { Hex } from '@/domain/shared/eth'
import { TabName, TabResource } from '@/features/tab-config'
import { useOwnedTokenIds } from './use-owned-tokenids'

// rules per tab for marking a domain item as "mine"
export function useMine<K extends TabName>(
  tab: TabName,
  user: Hex | undefined,
  collection: Hex | undefined
) {
  const { ids } = useOwnedTokenIds(collection, user)

  // normalize tokenIds for query building
  const ownedIds = useMemo(() => ids?.map(id => id.toString()) ?? [], [ids])

  const isMine = useCallback(
    (item: TabResource[K]) => {
      if (!user) return false

      switch (tab) {
        case 'feed':
          return (item as TabResource['feed']).actor === user
        case 'explore':
          return ids.includes((item as TabResource['explore']).tokenId)
        case 'sales':
          return (
            (item as TabResource['sales']).buyer === user ||
            (item as TabResource['sales']).seller === user
          )
      }
    },
    [tab, user, ids]
  )

  const buildMineQuery = useCallback(
    (filters: Record<string, string[]>) => {
      if (!user) return filters

      switch (tab) {
        case 'feed':
          return {
            ...filters,
            actor: [user],
          }

        case 'sales':
          return {
            ...filters,
            seller: [user], // or buyer/seller depending on API
          }

        case 'explore':
          if (ownedIds.length === 0) return undefined
          return {
            ...filters,
            tokenId: ownedIds,
          }

        default:
          return filters
      }
    },
    [tab, user, ownedIds]
  )

  return { buildMineQuery, isMine }
}
