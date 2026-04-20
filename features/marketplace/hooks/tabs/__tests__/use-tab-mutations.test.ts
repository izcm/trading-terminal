import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import { TabName, TabResource } from '@/features/tab-config'
import { Page } from '@/lib/utils/http'

import { useTabMutations } from '../use-tab-mutations'

type TabPages = { [K in TabName]: Page<TabResource[K]> }

describe('use-tab-mutations', () => {
  // the hook input `setState` is of tpe Dispatch<SetStateAction<TabPages>>
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
    return { result, getState: () => state }
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
    feed: { items: [{ id: '1' }, { id: '2' }, { id: '3' }] as TabResource['feed'][], cursor: null },
  }

  const populatedSales = {
    sales: {
      items: [{ id: '4' }, { id: '5' }, { id: '6' }] as TabResource['sales'][],
      cursor: null,
    },
  }

  const populatedExplore = {
    explore: {
      items: [{ id: '7' }, { id: '8' }, { id: '9' }] as TabResource['explore'][],
      cursor: null,
    },
  }

  describe('addItem', () => {
    const itemToAdd = { id: '999' } as TabResource['feed']

    it('prepends new item to tab items', () => {
      const getState = renderHookAndAct({
        run: m => m.addItem('feed', itemToAdd),
        withState: populatedFeed,
      })

      expect(getState().feed.items[0]).toBe(itemToAdd)
    })

    it('keeps existing tab items', () => {
      const getState = renderHookAndAct({
        run: m => m.addItem('feed', itemToAdd),
        withState: populatedFeed,
      })

      expect(getState().feed.items).toEqual([itemToAdd, ...populatedFeed.feed.items])
    })

    it('does not affect other tabs', () => {
      const getState = renderHookAndAct({
        run: m => m.addItem('feed', itemToAdd),
        withState: { ...populatedFeed, ...populatedSales, ...populatedExplore },
      })

      expect(getState()).toMatchObject({ ...populatedSales, ...populatedExplore })
    })
  })

  describe('addItemSorted', () => {
    it('inserts item in correct position (desc default)')
    it('inserts item in correct position (asc)')
    it('appends item when it belongs at the end')
    it('does nothing if sort field is invalid')
    it('does not affect other tabs')
  })

  describe('updateItem', () => {
    const updatedItem = { id: '2', title: 'updated' } as unknown as TabResource['feed']

    it('applies updater to the matching item', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('feed', '2', () => updatedItem),
        withState: populatedFeed,
      })

      expect(getState().feed.items.find(i => i.id === '2')).toBe(updatedItem)
    })

    it('leaves non-matching items unchanged', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('feed', '2', () => updatedItem),
        withState: populatedFeed,
      })

      const nonMatchingBefore = populatedFeed.feed.items.filter(item => item.id !== '2')
      const nonMatchingAfter = getState().feed.items.filter(item => item.id !== '2')

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
        run: m => m.updateItem('feed', '2', () => updatedItem),
        withState: { ...populatedFeed, ...populatedSales, ...populatedExplore },
      })

      expect(getState()).toMatchObject({ ...populatedSales, ...populatedExplore })
    })
  })

  describe('mergePage', () => {})
})
