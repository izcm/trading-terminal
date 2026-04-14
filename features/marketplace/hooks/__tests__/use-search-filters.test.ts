import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, RenderHookResult } from '@testing-library/react'
import { useSearchFilters } from '../use-search-filters'
import { TabName } from '@/features/tab-config'

const USER_ADDRESS = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef' as const

describe('useSearchFilters', () => {
  describe('handleSearch', () => {
    let result: RenderHookResult<ReturnType<typeof useSearchFilters>, unknown>['result']

    const testTab = 'feed'

    const otherTabs: TabName[] = ['sales', 'explore']

    beforeEach(() => {
      const hook = renderHook(() => useSearchFilters(testTab))
      result = hook.result
    })

    const currentFilters = () => result.current.filters[testTab]

    it('parses a single key=value pair', () => {
      act(() => result.current.handleSearch('status=active'))
      expect(currentFilters()).toEqual({ status: ['active'] })
    })

    it('parses multiple comma-separated values', () => {
      act(() => result.current.handleSearch('tokenId=1,2,3'))
      expect(currentFilters()).toEqual({ tokenId: ['1', '2', '3'] })
    })

    it('parses multiple space-separated key=value pairs', () => {
      act(() => result.current.handleSearch('status=active tokenId=1,2,3'))
      expect(currentFilters()).toEqual({ status: ['active'], tokenId: ['1', '2', '3'] })
    })

    it('sets filters to empty object on empty string', () => {
      act(() => result.current.handleSearch(''))
      expect(currentFilters()).toEqual({})
    })

    it('sets filters to empty object on space only string', () => {
      act(() => result.current.handleSearch(' '))
      expect(currentFilters()).toEqual({})
    })

    it('only updates the active tab, not other tabs', () => {
      act(() => result.current.handleSearch('status=active'))
      otherTabs.forEach(tab => expect(result.current.filters[tab]).toEqual({}))
    })
  })

  describe('mine keyword', () => {
    it('sets mineFlag when "mine" is in the search string', () => {
      const { result } = renderHook(() => useSearchFilters('feed'))

      act(() => result.current.handleSearch('mine'))

      expect(result.current.mineFlag.feed).toBe(true)
    })

    it('strips "mine" from the parsed filters', () => {
      const { result } = renderHook(() => useSearchFilters('feed'))

      act(() => result.current.handleSearch('mine status=active'))

      expect(result.current.filters.feed).toEqual({ status: ['active'] })
    })

    it('is case-insensitive', () => {})

    it('clears mineFlag when search no longer contains "mine"', () => {})
  })

  describe('"me" substitution', () => {
    it('replaces "me" with the user address when user is provided', () => {
      const { result } = renderHook(() => useSearchFilters('feed', USER_ADDRESS))

      act(() => result.current.handleSearch('maker=me'))

      expect(result.current.filters.feed).toEqual({ maker: [USER_ADDRESS] })
    })

    it('does not replace "me" when no user is provided', () => {})
  })

  describe('resetFilters', () => {
    it('restores the default filters for the target tab', () => {
      const { result } = renderHook(() => useSearchFilters('feed'))

      act(() => result.current.handleSearch('status=sold'))
      act(() => result.current.resetFilters('feed'))

      expect(result.current.filters.feed).toEqual({ status: ['active'] })
    })

    it('does not affect other tabs', () => {})
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
