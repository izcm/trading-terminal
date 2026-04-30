import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import { TabName, TabResource } from '@/features/tab-config'
import { Page } from '@/lib/utils/http'

import { useTabMutations } from '../use-tab-mutations'

type TabPages = { [K in TabName]: Page<TabResource[K]> }

describe('use-tab-mutations', () => {
  // the hook input `setState` is of type Dispatch<SetStateAction<TabPages>>
  // that means: a function that accepts either a new state, or a function that takes the old state (prev)
  // and returns a new state.
  // Dispatch: a function that takes one argument and returns nothing
  // full type: (value: TabPages | (prev: TabPages) => TabPages) => void
  const renderHookWith = (overrides: Partial<TabPages> = {}) => {
    let state = {
      feed: { items: [], cursor: null },
      explore: { items: [], cursor: null },
      sales: { items: [], cursor: null },
      ...overrides,
    }

    const setState = vi.fn(fn => {
      state = fn(state)
    })

    const { result } = renderHook(() => useTabMutations(setState))
    return { result, getState: () => state, setState }
  }

  function renderHookAndAct({
    run,
    withState = {},
  }: {
    run: (m: ReturnType<typeof useTabMutations>) => void
    withState?: Partial<TabPages>
  }) {
    const { result, getState } = renderHookWith(withState)

    act(() => run(result.current))

    return getState
  }

  const populatedFeed = {
    feed: { items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] as TabResource['feed'][], cursor: null },
  }

  const populatedSales = {
    sales: {
      items: [{ id: 'd' }, { id: 'e' }, { id: 'f' }] as TabResource['sales'][],
      cursor: null,
    },
  }

  const populatedExplore = {
    explore: {
      items: [{ id: 'g' }, { id: 'h' }, { id: 'j' }] as TabResource['explore'][],
      cursor: null,
    },
  }

  describe('addItem', () => {
    const addedItem = { id: 'aaa' } as TabResource['feed']

    it('prepends new item to tab items', () => {
      const getState = renderHookAndAct({
        run: m => m.addItem('feed', addedItem),
        withState: populatedFeed,
      })

      expect(getState().feed.items[0]).toBe(addedItem)
    })

    it('keeps existing tab items', () => {
      const getState = renderHookAndAct({
        run: m => m.addItem('feed', addedItem),
        withState: populatedFeed,
      })

      expect(getState().feed.items).toEqual([addedItem, ...populatedFeed.feed.items])
    })

    it('does not affect other tabs', () => {
      const getState = renderHookAndAct({
        run: m => m.addItem('feed', addedItem),
        withState: { ...populatedFeed, ...populatedSales, ...populatedExplore },
      })

      expect(getState()).toMatchObject({ ...populatedSales, ...populatedExplore })
    })
  })

  describe('addItemSorted', () => {
    const itemsAsc = [{ createdAt: 1 }, { createdAt: 3 }, { createdAt: 5 }] as TabResource['feed'][]
    const itemsDesc = [...itemsAsc].sort((a, b) => b.createdAt - a.createdAt)

    const addedItem = { createdAt: 2 } as TabResource['feed']

    const sortedFeed = (dir: 'asc' | 'desc' = 'desc') => ({
      feed: { items: dir === 'asc' ? itemsAsc : itemsDesc, cursor: null },
    })

    it('inserts item in correct position with default sort (createdAt, desc)', () => {
      const getState = renderHookAndAct({
        run: m => m.addItemSorted('feed', addedItem),
        withState: sortedFeed('desc'),
      })

      expect(getState().feed.items[2]).toEqual(addedItem) // 5, 3, 2, 1
    })

    it('inserts item in correct position (createdAt, asc)', () => {
      const getState = renderHookAndAct({
        run: m => m.addItemSorted('feed', addedItem, { dir: 'asc' }),
        withState: sortedFeed('asc'),
      })

      expect(getState().feed.items[1]).toEqual(addedItem) // 1, 2, 3, 5
    })

    it('inserts item in correct position non-defaults (start, asc)', () => {
      const items = [{ start: 1 }, { start: 3 }, { start: 5 }] as TabResource['feed'][]
      const added = { start: 2 } as TabResource['feed']

      const getState = renderHookAndAct({
        run: m => m.addItemSorted('feed', added, { field: 'start', dir: 'asc' }),
        withState: { feed: { items, cursor: null } },
      })

      expect(getState().feed.items[1]).toEqual(added) // 1, 2, 3, 5
    })

    it.each([
      ['asc', { createdAt: 999 }],
      ['desc', { createdAt: 0 }],
    ])('appends item when it belongs at the end (%s)', (dir, item) => {
      const getState = renderHookAndAct({
        run: m =>
          m.addItemSorted('feed', item as unknown as TabResource['feed'], {
            dir: dir as 'asc' | 'desc',
          }),
        withState: sortedFeed(dir as 'asc' | 'desc'),
      })

      expect(getState().feed.items[sortedFeed(dir as 'asc' | 'desc').feed.items.length]).toEqual(
        item
      )
    })

    it('does nothing if sort field is invalid', () => {
      const { result, setState } = renderHookWith(sortedFeed())

      act(() => result.current.addItemSorted('feed', addedItem, { field: 'invalid' }))

      expect(setState).not.toHaveBeenCalledOnce()
    })
  })

  describe('updateItem', () => {
    const updatedItem = { id: 'b', title: 'updated' } as unknown as TabResource['feed']
    const updatedId = updatedItem.id

    it('applies updater to the matching item', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('feed', updatedId, () => updatedItem),
        withState: populatedFeed,
      })

      expect(getState().feed.items.find(i => i.id === updatedId)).toBe(updatedItem)
    })

    it('leaves non-matching items unchanged', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('feed', updatedId, () => updatedItem),
        withState: populatedFeed,
      })

      const nonMatchingBefore = populatedFeed.feed.items.filter(item => item.id !== updatedId)
      const nonMatchingAfter = getState().feed.items.filter(item => item.id !== updatedId)

      expect(nonMatchingAfter).toEqual(nonMatchingBefore)
    })

    it('does nothing when id is not found', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('feed', 'nonexistent', () => updatedItem),
        withState: populatedFeed,
      })

      expect(getState().feed.items).toEqual(populatedFeed.feed.items)
    })

    it('does not affect other tabs', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('feed', updatedId, () => updatedItem),
        withState: { ...populatedFeed, ...populatedSales, ...populatedExplore },
      })

      expect(getState()).toMatchObject({ ...populatedSales, ...populatedExplore })
    })
  })

  describe('mergePage', () => {
    const newItems = [{ id: 'm_a' }, { id: 'm_b' }, { id: 'm_c' }] as TabResource['feed'][]
    const newCursor = 'cursor_123'

    it('merges new items into existing page', () => {
      // smoke test ensures existing state and newItems have no mutual members
      const sharedIds = newItems.filter(n => populatedFeed.feed.items.some(e => e.id === n.id))
      expect(sharedIds).toHaveLength(0)

      const getState = renderHookAndAct({
        run: m => m.mergePage('feed', newItems, newCursor),
        withState: populatedFeed,
      })

      expect(getState().feed).toEqual({
        items: [...populatedFeed.feed.items, ...newItems],
        cursor: newCursor,
      })
    })

    it('sets cursor to new string value', () => {
      const getState = renderHookAndAct({
        run: m => m.mergePage('feed', [], newCursor),
        withState: { feed: { items: [], cursor: null } },
      })

      expect(getState().feed.cursor).toBe(newCursor)
    })

    it('sets cursor to new null value', () => {
      const getState = renderHookAndAct({
        run: m => m.mergePage('feed', [], null),
        withState: { feed: { items: [], cursor: 'old' } },
      })

      expect(getState().feed.cursor).toBe(null)
    })

    it('does not insert duplicates', () => {
      const duplicate = populatedFeed.feed.items[0]

      const getState = renderHookAndAct({
        run: m => m.mergePage('feed', [...newItems, duplicate], newCursor),
        withState: populatedFeed,
      })

      expect(getState().feed.items.filter(item => item.id === duplicate.id)).toHaveLength(1)
    })

    it('does not affect other tabs', () => {
      const getState = renderHookAndAct({
        run: m => m.mergePage('feed', newItems, newCursor),
        withState: { ...populatedFeed, ...populatedSales, ...populatedExplore },
      })

      expect(getState()).toMatchObject({ ...populatedSales, ...populatedExplore })
    })
  })

  describe('replacePage', () => {
    const newPage = {
      items: [{ id: 'r_a' }, { id: 'r_b' }, { id: 'r_c' }] as TabResource['feed'][],
      cursor: 'cursor_123',
    }

    it('replaces tab page', () => {
      const getState = renderHookAndAct({
        run: m => m.replacePage('feed', newPage),
        withState: populatedFeed,
      })

      expect(getState().feed).toEqual(newPage)
    })
  })
})
