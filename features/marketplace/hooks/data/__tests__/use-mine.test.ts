import { describe, it, expect } from 'vitest'
import { renderHook, RenderHookResult } from '@testing-library/react'

import { Hex } from '@/domain/shared/eth'
import { TabName, TabResource } from '@/features/tab-config'

import { useMine } from '../use-mine'

describe('useMine', () => {
  type HookProps = Parameters<typeof useMine>
  type FreshHook = RenderHookResult<ReturnType<typeof useMine>, HookProps>

  const ACCOUNT = '0xaaaa'
  const DIFFERENT_ACCOUNT = '0xbbbb'
  const TOKEN_IDS = [1n, 2n, 3n]

  const anyTab: TabName = 'orders' // for tests where tab is irrelevant

  describe('buildMineQuery', () => {
    const buildMineQuery = (filters: Record<string, string[]>, hook: FreshHook) =>
      hook.result.current.buildMineQuery(filters)

    const baseFilters = () => ({
      status: ['active'],
    })

    it('returns unaltered filters when account undefined', () => {
      const hook = renderHook(() => useMine(anyTab, undefined, []))

      const mineQuery = buildMineQuery(baseFilters(), hook)

      expect(mineQuery).toEqual(baseFilters())
    })

    it.each([
      ['orders', { 'or.tokenId': TOKEN_IDS.map(String), 'or.side': ['0'] }],
      ['nfts', { tokenId: TOKEN_IDS.map(String) }],
      ['trades', { 'or.buyer': [ACCOUNT], 'or.seller': [ACCOUNT] }],
    ] as [TabName, Record<string, string[]>][])(
      'returns correct mineFilters for %s along with base filters',
      (tab, expected) => {
        const hook = renderHook(() => useMine(tab, ACCOUNT, TOKEN_IDS))

        const mineQuery = buildMineQuery(baseFilters(), hook)

        expect(mineQuery).toEqual({
          ...baseFilters(),
          ...expected,
        })
      }
    )
  })

  describe('isMine', () => {
    const isMine = (item: TabResource[TabName], hook: FreshHook) => hook.result.current.isMine(item)

    const notMineTokenId = BigInt(Math.max(...TOKEN_IDS.map(tid => Number(tid))) + 1)

    const mineVariants: { [K in TabName]: Array<Partial<TabResource[K]>> } = {
      orders: [
        { actor: ACCOUNT, tokenId: notMineTokenId }, // actor clause
        { actor: DIFFERENT_ACCOUNT, tokenId: TOKEN_IDS[0] }, // owned-id clause
      ],
      nfts: [{ tokenId: TOKEN_IDS[0] }],
      trades: [
        { seller: ACCOUNT, buyer: DIFFERENT_ACCOUNT }, // seller clause
        { seller: DIFFERENT_ACCOUNT, buyer: ACCOUNT }, // buyer clause
      ],
    }

    it.each(['orders', 'nfts', 'trades'] as TabName[])(
      'returns true for all %s `mine` variants',
      tab => {
        const hook = renderHook(() => useMine(tab, ACCOUNT, TOKEN_IDS))
        mineVariants[tab].forEach(variant =>
          expect(isMine(variant as TabResource[TabName], hook)).toBe(true)
        )
      }
    )

    it.each([
      ['orders', { actor: DIFFERENT_ACCOUNT, tokenId: notMineTokenId }],
      ['nfts', { tokenId: notMineTokenId }],
      ['trades', { buyer: DIFFERENT_ACCOUNT, seller: DIFFERENT_ACCOUNT }],
    ] as [TabName, Partial<TabResource[TabName]>][])(
      'returns false when item is not a %s `mine` variant',
      (tab, item) => {
        const hook = renderHook(() => useMine(tab, ACCOUNT, TOKEN_IDS))
        expect(isMine(item as TabResource[TabName], hook)).toBe(false)
      }
    )
  })

  describe('isMyListing', () => {
    const isMyListing = (actor: Hex, account: Hex | undefined) => {
      const hook = renderHook(() => useMine(anyTab, account, []))
      return hook.result.current.isMyListing({ actor })
    }

    it('returns true when account is listing actor', () => {
      expect(isMyListing(ACCOUNT, ACCOUNT)).toBe(true)
    })

    it('returns false when account is not listing actor', () => {
      expect(isMyListing(DIFFERENT_ACCOUNT, ACCOUNT)).toBe(false)
    })

    it('returns false when account is undefined', () => {
      expect(isMyListing('0xwhatever', undefined)).toBe(false)
    })
  })
})
