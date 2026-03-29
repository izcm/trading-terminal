import { useCallback, useMemo } from 'react'

import { Hex } from '@/domain/shared/eth'
import { TabName, TabResource } from '@/features/tab-config'
import { useOwnedTokenIds } from './use-owned-tokenids'
import { Listing } from '@/domain/listing'

// rules per tab for marking a domain item as "mine"
export function useMine<K extends TabName>(
  tab: TabName,
  user: Hex | undefined,
  collection: Hex | undefined
) {
  const { ids } = useOwnedTokenIds(collection, user)

  // normalize tokenIds
  const ownedIds = useMemo(() => ids?.map(id => id.toString()) ?? [], [ids])

  // my tokens
  const isMyToken = useCallback(
    (item: TabResource[K]) => {
      if (!user) return false
      return ids.includes(item.tokenId)
    },
    [user, ids]
  )

  // helps decide whether to show cancel btn
  const isMyListing = useCallback(
    (item: TabResource[K]) => {
      if (!user || tab !== 'feed') return false
      return (item as Listing).actor === user
    },
    [tab, user]
  )

  const buildMineQuery = useCallback(
    (filters: Record<string, string[]>) => {
      if (!user) return filters

      return {
        ...filters,
        tokenId: ownedIds,
      }
    },
    [user, ownedIds]
  )

  return { buildMineQuery, isMyToken, isMyListing }
}
