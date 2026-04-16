import { Dispatch, SetStateAction, useCallback } from 'react'

import { Page } from '@/lib/utils/http'
import { TabName, TabResource } from '../../tab-config'

type TabPages = {
  [K in TabName]: Page<TabResource[K]>
}

export function useTabMutations(setState: Dispatch<SetStateAction<TabPages>>) {
  const addItem = useCallback(
    <K extends TabName>(tab: K, item: TabResource[K]) => {
      setState(prev => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          items: [item, ...prev[tab].items],
        },
      }))
    },
    [setState]
  )

  const addItemSorted = useCallback(
    <K extends TabName>(
      tab: K,
      item: TabResource[K],
      sort?: { field?: string; dir?: 'asc' | 'desc' }
    ) => {
      const field = sort?.field ?? 'createdAt'
      const dir = sort?.dir ?? 'desc'

      function isSortableKey(
        item: TabResource[K],
        key: string
      ): key is keyof TabResource[K] & string {
        return key in item
      }

      if (!isSortableKey(item, field)) return // ignore if user inputs invalid sort config in searchbar

      const sortField = field // capture narrowed key

      setState(prev => {
        const items = prev[tab].items

        const idx = items.findIndex(i =>
          dir === 'asc' ? i[sortField] > item[sortField] : i[sortField] < item[sortField]
        )

        console.log(idx)

        // idx === -1 => the item belongs at end
        const next =
          idx === -1 ? [...items, item] : [...items.slice(0, idx), item, ...items.slice(idx)]

        return {
          ...prev,
          [tab]: { ...prev[tab], items: next },
        }
      })
    },

    [setState]
  )

  const updateItem = useCallback(
    <K extends TabName>(tab: K, id: string, updater: (item: TabResource[K]) => TabResource[K]) => {
      setState(prev => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          items: prev[tab].items.map(item => (item.id === id ? updater(item) : item)),
        },
      }))
    },
    [setState]
  )

  const mergePage = useCallback(
    <K extends TabName>(tab: K, items: TabResource[K][], cursor: string | null) => {
      setState(prev => {
        const existing = new Set(prev[tab].items.map(i => i.id))

        return {
          ...prev,
          [tab]: {
            items: [...prev[tab].items, ...items.filter(n => !existing.has(n.id))],
            cursor,
          },
        }
      })
    },
    [setState]
  )

  const replacePage = useCallback(
    <K extends TabName>(tab: K, page: Page<TabResource[K]>) => {
      setState(prev => ({
        ...prev,
        [tab]: page,
      }))
    },
    [setState]
  )

  return { addItem, addItemSorted, updateItem, mergePage, replacePage }
}
