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
      orders: { items: [], nextCursor: null },
      nfts: { items: [], nextCursor: null },
      trades: { items: [], nextCursor: null },
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

  const populatedOrders = {
    orders: {
      items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] as TabResource['orders'][],
      nextCursor: null,
    },
  }

  const populatedTrades = {
    trades: {
      items: [{ id: 'd' }, { id: 'e' }, { id: 'f' }] as TabResource['trades'][],
      nextCursor: null,
    },
  }

  const populatedNfts = {
    nfts: {
      items: [{ id: 'g' }, { id: 'h' }, { id: 'j' }] as TabResource['nfts'][],
      nextCursor: null,
    },
  }

  describe('addItem', () => {
    const addedItem = { id: 'aaa' } as TabResource['orders']

    it('prepends new item to tab items', () => {
      const getState = renderHookAndAct({
        run: m => m.addItem('orders', addedItem),
        withState: populatedOrders,
      })

      expect(getState().orders.items[0]).toBe(addedItem)
    })

    it('keeps existing tab items', () => {
      const getState = renderHookAndAct({
        run: m => m.addItem('orders', addedItem),
        withState: populatedOrders,
      })

      expect(getState().orders.items).toEqual([addedItem, ...populatedOrders.orders.items])
    })

    it('does not affect other tabs', () => {
      const getState = renderHookAndAct({
        run: m => m.addItem('orders', addedItem),
        withState: { ...populatedOrders, ...populatedTrades, ...populatedNfts },
      })

      expect(getState()).toMatchObject({ ...populatedTrades, ...populatedNfts })
    })
  })

  describe('addItemSorted', () => {
    const itemsAsc = [{ createdAt: 1 }, { createdAt: 3 }, { createdAt: 5 }] as TabResource['orders'][]
    const itemsDesc = [...itemsAsc].sort((a, b) => b.createdAt - a.createdAt)

    const addedItem = { createdAt: 2 } as TabResource['orders']

    const sortedOrders = (dir: 'asc' | 'desc' = 'desc') => ({
      orders: { items: dir === 'asc' ? itemsAsc : itemsDesc, nextCursor: null },
    })

    it('inserts item in correct position with default sort (createdAt, desc)', () => {
      const getState = renderHookAndAct({
        run: m => m.addItemSorted('orders', addedItem),
        withState: sortedOrders('desc'),
      })

      expect(getState().orders.items[2]).toEqual(addedItem) // 5, 3, 2, 1
    })

    it('inserts item in correct position (createdAt, asc)', () => {
      const getState = renderHookAndAct({
        run: m => m.addItemSorted('orders', addedItem, { dir: 'asc' }),
        withState: sortedOrders('asc'),
      })

      expect(getState().orders.items[1]).toEqual(addedItem) // 1, 2, 3, 5
    })

    it('inserts item in correct position non-defaults (start, asc)', () => {
      const items = [{ start: 1 }, { start: 3 }, { start: 5 }] as TabResource['orders'][]
      const added = { start: 2 } as TabResource['orders']

      const getState = renderHookAndAct({
        run: m => m.addItemSorted('orders', added, { field: 'start', dir: 'asc' }),
        withState: { orders: { items, nextCursor: null } },
      })

      expect(getState().orders.items[1]).toEqual(added) // 1, 2, 3, 5
    })

    it.each([
      ['asc', { createdAt: 999 }],
      ['desc', { createdAt: 0 }],
    ])('appends item when it belongs at the end (%s)', (dir, item) => {
      const getState = renderHookAndAct({
        run: m =>
          m.addItemSorted('orders', item as unknown as TabResource['orders'], {
            dir: dir as 'asc' | 'desc',
          }),
        withState: sortedOrders(dir as 'asc' | 'desc'),
      })

      expect(getState().orders.items[sortedOrders(dir as 'asc' | 'desc').orders.items.length]).toEqual(
        item
      )
    })

    it('does nothing if sort field is invalid', () => {
      const { result, setState } = renderHookWith(sortedOrders())

      act(() => result.current.addItemSorted('orders', addedItem, { field: 'invalid' }))

      expect(setState).not.toHaveBeenCalledOnce()
    })
  })

  describe('updateItem', () => {
    const updatedItem = { id: 'b', title: 'updated' } as unknown as TabResource['orders']
    const updatedId = updatedItem.id

    it('applies updater to the matching item', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('orders', updatedId, () => updatedItem),
        withState: populatedOrders,
      })

      expect(getState().orders.items.find(i => i.id === updatedId)).toBe(updatedItem)
    })

    it('leaves non-matching items unchanged', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('orders', updatedId, () => updatedItem),
        withState: populatedOrders,
      })

      const nonMatchingBefore = populatedOrders.orders.items.filter(item => item.id !== updatedId)
      const nonMatchingAfter = getState().orders.items.filter(item => item.id !== updatedId)

      expect(nonMatchingAfter).toEqual(nonMatchingBefore)
    })

    it('does nothing when id is not found', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('orders', 'nonexistent', () => updatedItem),
        withState: populatedOrders,
      })

      expect(getState().orders.items).toEqual(populatedOrders.orders.items)
    })

    it('does not affect other tabs', () => {
      const getState = renderHookAndAct({
        run: m => m.updateItem('orders', updatedId, () => updatedItem),
        withState: { ...populatedOrders, ...populatedTrades, ...populatedNfts },
      })

      expect(getState()).toMatchObject({ ...populatedTrades, ...populatedNfts })
    })
  })

  describe('mergePage', () => {
    const newItems = [{ id: 'm_a' }, { id: 'm_b' }, { id: 'm_c' }] as TabResource['orders'][]
    const newCursor = 'cursor_123'

    it('merges new items into existing page', () => {
      // smoke test ensures existing state and newItems have no mutual members
      const sharedIds = newItems.filter(n => populatedOrders.orders.items.some(e => e.id === n.id))
      expect(sharedIds).toHaveLength(0)

      const getState = renderHookAndAct({
        run: m => m.mergePage('orders', newItems, newCursor),
        withState: populatedOrders,
      })

      expect(getState().orders).toEqual({
        items: [...populatedOrders.orders.items, ...newItems],
        nextCursor: newCursor,
      })
    })

    it('sets cursor to new string value', () => {
      const getState = renderHookAndAct({
        run: m => m.mergePage('orders', [], newCursor),
        withState: { orders: { items: [], nextCursor: null } },
      })

      expect(getState().orders.nextCursor).toBe(newCursor)
    })

    it('sets cursor to new null value', () => {
      const getState = renderHookAndAct({
        run: m => m.mergePage('orders', [], null),
        withState: { orders: { items: [], nextCursor: 'old' } },
      })

      expect(getState().orders.nextCursor).toBe(null)
    })

    it('does not insert duplicates', () => {
      const duplicate = populatedOrders.orders.items[0]

      const getState = renderHookAndAct({
        run: m => m.mergePage('orders', [...newItems, duplicate], newCursor),
        withState: populatedOrders,
      })

      expect(getState().orders.items.filter(item => item.id === duplicate.id)).toHaveLength(1)
    })

    it('does not affect other tabs', () => {
      const getState = renderHookAndAct({
        run: m => m.mergePage('orders', newItems, newCursor),
        withState: { ...populatedOrders, ...populatedTrades, ...populatedNfts },
      })

      expect(getState()).toMatchObject({ ...populatedTrades, ...populatedNfts })
    })
  })

  describe('replacePage', () => {
    const newPage = {
      items: [{ id: 'r_a' }, { id: 'r_b' }, { id: 'r_c' }] as TabResource['orders'][],
      nextCursor: 'cursor_123',
    }

    it('replaces tab page', () => {
      const getState = renderHookAndAct({
        run: m => m.replacePage('orders', newPage),
        withState: populatedOrders,
      })

      expect(getState().orders).toEqual(newPage)
    })
  })
})
