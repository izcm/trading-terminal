import { describe, it, beforeEach, expect } from 'vitest'
import { renderHook, RenderHookResult } from '@testing-library/react'

import { TabName, TabResource } from '@/features/tab-config'

import { useMine } from '../use-mine'

describe('useMine', () => {
  type HookProps = Parameters<typeof useMine>

  let hook: RenderHookResult<ReturnType<typeof useMine>, HookProps>

  const ACCOUNT = '0xaaaa'
  const OTHER = '0xbbbb'
  const TOKEN_ID = 44n

  const defaultTab: TabName = 'feed'
  // const otherTabs: TabName[] = ['sales', 'explore']

  describe('buildMineQuery', () => {
    beforeEach(() => {
      const initialProps: HookProps = [defaultTab, ACCOUNT, [TOKEN_ID]] as HookProps

      hook = renderHook((props: HookProps) => useMine(...props), {
        initialProps,
      })
    })

    const buildMineQuery = (filters: Record<string, string[]>) =>
      hook.result.current.buildMineQuery(filters)

    const baseFilters = () => ({
      status: ['active'],
    })

    it.each([['feed'], ['sales'], ['explore']])('appends correct mineFilters to %s', tab => {})

    it('appends correct mineFilters on tab %s', () => {})

    it('returns unaltered filters when account undefined', () => {
      const noAccountHook = renderHook((props: HookProps) => useMine(...props), {
        initialProps: [defaultTab, undefined, []] as HookProps,
      })

      const mineQuery = noAccountHook.result.current.buildMineQuery(baseFilters())

      expect(mineQuery).toEqual(baseFilters())
    })
  })

  describe('isMine', () => {
    function givenResource<T extends TabName>(tab: T, mine: boolean): Partial<TabResource[T]> {
      const r: { [K in keyof TabResource]: Partial<TabResource[K]> } = {
        feed: { actor: mine ? ACCOUNT : OTHER, tokenId: TOKEN_ID },
        explore: { tokenId: mine ? TOKEN_ID : TOKEN_ID + 1n },
        sales: { seller: mine ? ACCOUNT : OTHER, buyer: OTHER },
      }

      return r[tab]
    }

    it('returns true when item satisfies isMine rules', () => {})
    it('returns false when item does not satisfy isMine rules')
  })
})
