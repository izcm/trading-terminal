import { useCallback, useEffect, useMemo, useState } from 'react'

import type { Hex } from '@/domain/shared/eth'

import type { Page } from '@/lib/utils/http'
import { connectWs } from '@/lib/realtime/ws'
import { getWsUrl } from '@/lib/dmrkt-indexer/config'

import { pageGetters, TabName, TabResource } from '@/features/tab-config'
import { useWsFeed, useWsSales } from '@/features/realtime/hooks'

import { useFresh } from './use-fresh'
import { useTabMutations } from '../tabs/use-tab-mutations'

type TabPages = {
  [K in TabName]: Page<TabResource[K]>
}

export function useMarketplaceData(
  initialPages: TabPages,
  tab: TabName,
  filters: Record<TabName, Record<string, string[]>>,
  mineFlag: Record<TabName, boolean>,
  chainId: number,
  collection: Hex,
  isMine: (item: TabResource[TabName]) => boolean,
  buildMineQuery: (filters: Record<string, string[]>) => Record<string, string[]>,
  onPageReplaced?: <K extends TabName>(tab: K, page: Page<TabResource[K]>) => void
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
      // if mine flag is active and fresh is not mine => don't do anything
      if (!isMine(item) && mineFlag[tab]) return

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
  useWsSales({ addItem: addItemAndMarkFresh, updateItem })

  // --- pagination ---
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

  const loadMore = useCallback(async () => {
    const currCursor = state[tab].cursor

    if (!currCursor || isLoadingMore) return

    setIsLoadingMore(true)

    const res = await pageGetters[tab]({
      filters: query,
      cursor: currCursor,
    })

    if (res.ok) {
      mergePage(tab, res.data.items, res.data.cursor)
    }

    setIsLoadingMore(false)
  }, [state, tab, isLoadingMore, query, mergePage])

  // --- page fetch trigger ---

  useEffect(() => {
    const run = async () => {
      const res = await pageGetters[tab]({ filters: query, cursor: null })

      if (!res.ok) return
      replacePage(tab, res.data)

      onPageReplaced?.(tab, res.data)
    }

    run()
  }, [tab, query, replacePage, onPageReplaced])

  return { state, isFresh, isLoadingMore, loadMore }
}
