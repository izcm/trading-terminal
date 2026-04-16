import { act } from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, RenderHookResult } from '@testing-library/react'

import { useFresh } from '../use-fresh'
import { TabName } from '@/features/tab-config'

describe('useFresh', () => {
  type HookProps = Parameters<typeof useFresh>

  let hook: RenderHookResult<ReturnType<typeof useFresh>, HookProps>

  const defaultTab = 'feed'
  const otherTabs: TabName[] = ['sales', 'explore']

  beforeEach(() => {
    vi.useFakeTimers()

    hook = renderHook((props: HookProps) => useFresh(...props), {
      initialProps: ['feed' as TabName],
    })
  })

  const add = (tab: TabName, id: string) => hook.result.current.add(tab, id)

  const isFresh = (tab: TabName, id: string) => hook.result.current.isFresh(tab, id)
  const isPending = (tab: TabName, id: string) => hook.result.current.isPending(tab, id)

  const rerender = (props: HookProps) => hook.rerender(props)

  const base = {
    tab: defaultTab as TabName,
    id: 'abc:123',
  }

  it('marks an item as fresh when added to the active tab', () => {
    const { tab, id } = base
    act(() => add(tab, id))
    expect(isFresh(tab, id)).toBe(true)
  })

  it('does not mark an item as pending when added to the active tab', () => {
    const { tab, id } = base
    act(() => add(tab, id))
    expect(isPending(tab, id)).toBe(false)
  })

  it('removes freshness after 2 seconds', () => {
    const { tab, id } = base

    act(() => add(tab, id))
    expect(isFresh(tab, id)).toBe(true)

    // advancing time => runs all setTimeout callbacks scheduled within 2s
    // since item was added on active tab, a timer was scheduled
    // that timer callback calls setFresh (React state update)
    // because this indirectly triggers a state update, we wrap in act()
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(isFresh(tab, id)).toBe(false)
  })

  it.each(otherTabs)('does not mark item as fresh for inactive tab: %s', tab => {
    act(() => add(tab, base.id))
    expect(isFresh(tab, base.id)).toBe(false)
  })

  it.each(otherTabs)('marks item as pending if added to an inactive tab', tab => {
    act(() => add(tab, base.id))
    expect(isPending(tab, base.id)).toBe(true)
  })

  // tab switch rerender
  it('flushes queued items when switching to that tab', () => {
    const id = base.id
    const tab = 'sales'

    // add to inactive tab => marked as pending
    act(() => add(tab, id))
    expect(isPending(tab, id)).toBe(true)
    expect(isFresh(tab, id)).toBe(false)

    // rerender with tab as activeTab
    act(() => rerender([tab]))

    // should flush pending and mark item as fresh
    expect(isPending(tab, id)).toBe(false)
    expect(isFresh(tab, id)).toBe(true)
  })

  it('flushes multiple queued items when switching tabs', () => {
    const tab = 'sales'
    const ids = ['a', 'b', 'c']

    // add all to inactive tab
    act(() => {
      ids.forEach(id => add(tab, id))
    })

    ids.forEach(id => {
      expect(isPending(tab, id)).toBe(true)
      expect(isFresh(tab, id)).toBe(false)
    })

    // switch tab
    act(() => rerender([tab]))

    ids.forEach(id => {
      expect(isPending(tab, id)).toBe(false)
      expect(isFresh(tab, id)).toBe(true)
    })
  })
})
