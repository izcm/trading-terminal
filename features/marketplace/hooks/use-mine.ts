import { useCallback, useEffect, useMemo, useRef } from 'react'

import { Hex } from '@/domain/shared/eth'
import { TabName, TabResource } from '@/features/tab-config'
import { Listing } from '@/domain/listing'

// rules per tab for marking a domain item as "mine"
export function useMine<K extends TabName>(
  tab: TabName,
  account: Hex | undefined,
  collection: Hex | undefined,
  ids: bigint[]
) {
  // normalize tokenIds
  const ownedIds = useMemo(() => ids?.map(id => id.toString()) ?? [], [ids])
  const ownedIdsRef = useRef(ownedIds)
  useEffect(() => { ownedIdsRef.current = ownedIds }, [ownedIds])

  // my tokens
  const isMyToken = useCallback(
    (item: TabResource[K]) => {
      if (!account) return false
      return ids.includes(item.tokenId)
    },
    [account, ids]
  )

  // helps decide whether to show cancel btn
  const isMyListing = useCallback(
    (item: TabResource[K]) => {
      if (!account || tab !== 'feed') return false
      return (item as Listing).actor === account
    },
    [tab, account]
  )

  const buildMineQuery = useCallback(
    (filters: Record<string, string[]>) => {
      if (!account) return filters

      return {
        ...filters,
        tokenId: ownedIdsRef.current,
      }
    },
    [account]
  )

  return { buildMineQuery, isMyToken, isMyListing }
}
