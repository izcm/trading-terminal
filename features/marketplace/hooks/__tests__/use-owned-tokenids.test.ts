import { describe, expect, it, vi } from 'vitest'
import { useOwnedTokenIds } from '../use-owned-tokenids'
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react'
import { Hex } from '@/domain/shared/eth'

describe('useOwnedTokenIds', () => {
  type HookProps = Parameters<typeof useOwnedTokenIds>
  type OwnedTokenIdsHook = RenderHookResult<ReturnType<typeof useOwnedTokenIds>, HookProps>

  describe('mount', () => {
    it('auto fetches on mount when inputs are valid', async () => {
      const readMock = vi.fn().mockResolvedValue([])

      renderHook(() => useOwnedTokenIds('0xabc', '0x123', readMock))

      await waitFor(() => expect(readMock).toHaveBeenCalled())
    })
  })

  describe('manual refetch', () => {
    const getRefetch = (hook: OwnedTokenIdsHook) => hook.result.current.refetch

    it.each([
      ['collection', undefined as Hex | undefined, '0xaccount' as Hex],
      ['account', '0xcollection' as Hex, undefined as Hex | undefined],
    ])('does nothing when %s is undefined', async (_, collection, account) => {
      const readMock = vi.fn()
      const hook = renderHook(() => useOwnedTokenIds(collection, account, readMock))

      const refetch = getRefetch(hook)
      await refetch()

      expect(readMock).not.toHaveBeenCalled()
    })
  })

  describe('refetch (manual)', () => {
    it('does not fetch when collection missing')
  })
})
