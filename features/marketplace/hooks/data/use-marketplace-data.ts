import { useCallback, useEffect, useMemo, useState } from 'react'

import type { Hex } from '@/domain/shared/eth'

import type { Page } from '@/lib/utils/http'
import { connectWs } from '@/lib/realtime/ws'
import { getWsUrl } from '@/lib/dmrkt-indexer/config'

import { pageGetters, TabName, TabResource } from '@/features/tab-config'
import { useWsFeed, useWsTrades } from '@/features/realtime/hooks'

import { useFresh } from './use-fresh'
import { useTabMutations } from '../tabs/use-tab-mutations'
import { itemMatchesFilters } from '../../lib/logic/matches-filters'

export type TabPages = {
  [K in TabName]: Page<TabResource[K]>
}

const emptyPages: TabPages = {
  feed: { items: [], nextCursor: null },
  explore: { items: [], nextCursor: null },
  trades: { items: [], nextCursor: null },
}

export function useMarketplaceData(
  tab: TabName,
  filters: Record<TabName, Record<string, string[]>>,
  mineFlag: Record<TabName, boolean>,
  chainId: number,
  collection: Hex,
  isMine: (item: TabResource[TabName]) => boolean,
  buildMineQuery: (filters: Record<string, string[]>) => Record<string, string[]>,
  onPageReplaced?: <K extends TabName>(tab: K, page: Page<TabResource[K]>) => void,
  isReady = false,
  initialPages: TabPages = emptyPages
) {
  const [state, setState] = useState<TabPages>(initialPages)
  const { add: addFresh, isFresh: isFresh } = useFresh(tab)
  const { mergePage, replacePage, addItemSorted, updateItem } = useTabMutations(setState)

  // --- query ---
  const query = useMemo(() => {
    const base: Record<string, string[]> = {
      ...filters[tab],
      chainId: [chainId.toString()],
      collection: [collection],
    }

    return mineFlag[tab] ? buildMineQuery(base) : base
  }, [tab, filters, chainId, collection, mineFlag, buildMineQuery])

  // --- ws ---
  useEffect(() => {
    connectWs(getWsUrl())
  }, [])

  const addItemAndMarkFresh = useCallback(
    <K extends TabName>(tab: K, item: TabResource[K]) => {
      // if mine flag is active and fresh is not mine -> skip
      if (!isMine(item) && mineFlag[tab]) return

      // if item does not pass active filters -> skip
      if (!itemMatchesFilters(item, filters[tab])) return

      const tabFilters = filters[tab]
      addItemSorted(tab, item, {
        field: tabFilters.sortField?.[0] ?? 'createdAt',
        dir: (tabFilters.sortDir?.[0] ?? 'desc') as 'asc' | 'desc',
      })
      addFresh(tab, item.id)
    },
    [addItemSorted, addFresh, isMine, mineFlag, filters]
  )

  useWsFeed({ addItem: addItemAndMarkFresh, updateItem })
  useWsTrades({ addItem: addItemAndMarkFresh, updateItem })

  // --- pagination ---
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

  const loadMore = useCallback(async () => {
    const currCursor = state[tab].nextCursor

    if (!currCursor || isLoadingMore) return

    console.log('IM IN USE MARKETPLCEDATA')
    setIsLoadingMore(true)

    const res = await pageGetters[tab]({
      filters: query,
      cursor: currCursor,
    })

    if (res.ok) {
      mergePage(tab, res.data.items, res.data.nextCursor)
    }

    setIsLoadingMore(false)
  }, [state, tab, isLoadingMore, query, mergePage])

  // --- page fetch trigger ---

  // buildMineQuery reads ownedIdsRef.current at call time, so calling it inline here
  // (not via query memo) guarantees fresh ids when isReady flips.
  // query is not used — the memo ran before ids loaded and won't rerun since buildMineQuery is stable.
  useEffect(() => {
    if (!isReady) return

    const controller = new AbortController()
    const base = { ...filters[tab], chainId: [chainId.toString()], collection: [collection] }
    const q = mineFlag[tab] ? buildMineQuery(base) : base

    pageGetters[tab]({ filters: q, cursor: null, signal: controller.signal }).then(res => {
      if (!res.ok) return
      replacePage(tab, res.data)
      onPageReplaced?.(tab, res.data)
    })

    return () => controller.abort()
  }, [tab, filters, mineFlag, chainId, collection, isReady, replacePage, onPageReplaced])

  return { state, isFresh, isLoadingMore, loadMore }
}
