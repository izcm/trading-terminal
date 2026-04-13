import { useCallback, useEffect, useMemo, useState } from 'react'

import { Page } from '@/lib/utils/http'
import { connectWs } from '@/lib/realtime/ws'

import { useTabMutations } from '@/features/marketplace/hooks/use-tab-mutations'
import { useWsFeed, useWsSales } from '@/features/realtime/hooks/use-ws-sub'
import { pageGetters, TabName, TabResource } from '@/features/tab-config'

import { useFresh } from './use-fresh'
import { Hex } from '@/domain/shared/eth'

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
  buildMineQuery: (filters: Record<string, string[]>) => Record<string, string[]>,
  onPageReplaced?: <K extends TabName>(tab: K, page: Page<TabResource[K]>) => void
) {
  const [state, setState] = useState<TabPages>(initialPages)
  const { add: addFresh, has: isFresh } = useFresh(tab)
  const { mergePage, replacePage, addItem, updateItem } = useTabMutations(setState)

  const addItemAndMarkFresh = useCallback(
    <K extends TabName>(tab: K, item: TabResource[K]) => {
      addItem(tab, item)
      addFresh(tab, item.id)
    },
    [addItem, addFresh]
  )

  // --- ws ---
  useEffect(() => {
    connectWs()
  }, [])

  useWsFeed({ addItem: addItemAndMarkFresh, updateItem })
  useWsSales({ addItem: addItemAndMarkFresh, updateItem })

  // --- query ---
  const query = useMemo(() => {
    const base = filters[tab]

    const activeFilters = {
      ...base,
      chainId: [chainId.toString()],
      collection: [collection],
    } satisfies Record<string, string[]>

    return mineFlag[tab] ? buildMineQuery(activeFilters) : activeFilters
  }, [tab, filters, mineFlag, chainId, collection, buildMineQuery])

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

  //   const tabRef = useRef(tab)

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
