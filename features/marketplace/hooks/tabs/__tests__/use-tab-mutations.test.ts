import { act } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import { TabName, TabResource } from '@/features/tab-config'
import { Page } from '@/lib/utils/http'

import { useTabMutations } from '../use-tab-mutations'

type TabPages = { [K in TabName]: Page<TabResource[K]> }

describe('use-tab-mutations', () => {
  const defaultInitial = {
    feed: { items: [{ id: '1' } as TabResource['feed']], cursor: null },
    explore: { items: [], cursor: null },
    sales: { items: [], cursor: null },
  }

  // the hook input `setState` is of tpe Dispatch<SetStateAction<TabPages>>
  // that means: a function that accepts either a new state, or a function that takes the old state (prev)
  // and returns a new state.
  // Dispatch: a function that takes one argument and returns nothing
  // full type: (value: TabPages | (prev: TabPages) => TabPages) => void
  const renderHookWith = (initial: TabPages = defaultInitial) => {
    let state = initial
    const setState = vi.fn(fn => {
      state = fn(state)
    })
    const { result } = renderHook(() => useTabMutations(setState))
    return { result, getState: () => state }
  }

  describe('addItem', () => {
    it('prepends new item to tab items', () => {
      const { result, getState } = renderHookWith()

      act(() => result.current.addItem('feed', { id: '2' } as TabResource['feed']))

      expect(getState().feed.items[0].id).toBe('2')
    })

    it('keeps existing items', () => {})
    it('does not affect other tabs', () => {})
  })

  describe('addItemSorted', () => {
    it('inserts item in correct position (desc default)')
    it('inserts item in correct position (asc)')
    it('appends item when it belongs at the end')
    it('does nothing if sort field is invalid')
    it('does not affect other tabs')
  })
})
