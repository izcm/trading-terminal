import { describe, it, vi } from 'vitest'
import { useOwnedTokenIds } from '../use-owned-tokenids'
import { renderHook, RenderHookResult } from '@testing-library/react'
import { Hex } from '@/domain/shared/eth'

describe('useOwnedTokenIds', () => {
  type HookProps = Parameters<typeof useOwnedTokenIds>
  type OwnedTokenIdsHook = RenderHookResult<ReturnType<typeof useOwnedTokenIds>, HookProps>

  describe('initial fetch', () => {
    it('calls readOwnedFn on initial render if valid inputs')
  })

  describe('manual refetch', () => {
    it.each([
      ['collection', undefined as Hex | undefined, '0xaccount' as Hex],
      ['account', '0xcollection' as Hex, undefined as Hex | undefined],
    ])('does nothing when %s is undefined', async (_, collection, account) => {
      const readMock = vi.fn()

      renderHook(() => useOwnedTokenIds(collection, account, readMock))
    })
  })

  describe('refetch (manual)', () => {
    it('does not fetch when collection missing')
  })
})
