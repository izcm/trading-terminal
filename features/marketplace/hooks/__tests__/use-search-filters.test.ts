import { describe, it, expect, beforeEach } from 'vitest'

import { renderHook, act, RenderHookResult } from '@testing-library/react'
import { TabName } from '@/features/tab-config'

import { DEFAULT_FILTERS, useSearchFilters } from '../use-search-filters'

describe('useSearchFilters', () => {
  let result: RenderHookResult<ReturnType<typeof useSearchFilters>, unknown>['result']

  const testTab = 'feed'

  const otherTabs: TabName[] = ['sales', 'explore']

  beforeEach(() => {
    const hook = renderHook(() => useSearchFilters(testTab))
    result = hook.result
  })

  const filters = (tab: TabName = testTab) => result.current.filters[tab]

  describe('handleSearch', () => {
    it('parses a single key=value pair', () => {
      act(() => result.current.handleSearch('status=active'))
      expect(filters()).toEqual({ status: ['active'] })
    })

    it('parses multiple comma-separated values', () => {
      act(() => result.current.handleSearch('tokenId=1,2,3'))
      expect(filters()).toEqual({ tokenId: ['1', '2', '3'] })
    })

    it('parses multiple space-separated key=value pairs', () => {
      act(() => result.current.handleSearch('status=active tokenId=1,2,3'))
      expect(filters()).toEqual({ status: ['active'], tokenId: ['1', '2', '3'] })
    })

    it('sets filters to empty object on empty string', () => {
      act(() => result.current.handleSearch(''))
      expect(filters()).toEqual({})
    })

    it('sets filters to empty object on space only string', () => {
      act(() => result.current.handleSearch(' '))
      expect(filters()).toEqual({})
    })

    it('only updates the active tab, not other tabs', () => {
      act(() => result.current.handleSearch('status=active'))
      otherTabs.forEach(tab => expect(filters(tab)).toEqual({}))
    })
  })

  describe('mine keyword', () => {
    const mineFlag = (tab: TabName = testTab) => result.current.mineFlag[tab]

    it('sets mineFlag when "mine" is in the search string', () => {
      act(() => result.current.handleSearch('mine'))
      expect(mineFlag()).toBe(true)
    })

    it('strips "mine" from the parsed filters', () => {
      act(() => result.current.handleSearch('mine status=active'))
      expect(filters()).toEqual({ status: ['active'] })
    })

    it('is case-insensitive', () => {
      act(() => result.current.handleSearch('mInE'))
      expect(mineFlag()).toBe(true)
    })

    it('clears mineFlag when search no longer contains "mine"', () => {
      act(() => result.current.handleSearch('mine'))
      expect(mineFlag()).toBe(true)
      act(() => result.current.handleSearch(''))
      expect(mineFlag()).toBe(false)
    })
  })

  describe('"me" substitution', () => {
    const USER_ADDRESS = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef' as const

    it('replaces "me" with the user address when user is provided', () => {
      const withUser = renderHook(() => useSearchFilters(testTab, USER_ADDRESS)).result

      act(() => withUser.current.handleSearch('maker=me'))

      expect(withUser.current.filters[testTab]).toEqual({ maker: [USER_ADDRESS] })
    })

    it('does not replace "me" when no user is provided', () => {
      act(() => result.current.handleSearch('maker=me'))
      expect(filters()).toEqual({ maker: ['me'] })
    })
  })

  describe('resetFilters', () => {
    it('restores the default filters for the target tab', () => {
      act(() => result.current.handleSearch('status=cancelled'))
      act(() => result.current.resetFilters(testTab))

      expect(result.current.filters.feed).toEqual(DEFAULT_FILTERS[testTab])
    })

    it('does not affect other tabs', () => {
      act(() =>
        result.current.setFilters(prev => ({
          ...prev,
          sales: { status: ['expired'] },
          explore: { tokenId: ['2'] },
        }))
      )

      act(() => result.current.resetFilters(testTab))

      expect(result.current.filters.sales).toEqual({ status: ['expired'] })
      expect(result.current.filters.explore).toEqual({ tokenId: ['2'] })
    })
  })

  describe('resetMineFlag', () => {
    it('clears the mine flag for the target tab', () => {
      const { result } = renderHook(() => useSearchFilters('feed'))

      act(() => result.current.handleSearch('mine'))
      act(() => result.current.resetMineFlag('feed'))

      expect(result.current.mineFlag.feed).toBe(false)
    })
  })
})
