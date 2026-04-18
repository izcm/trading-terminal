import { describe, expect, it, Mock, vi } from 'vitest'
import { useOwnedTokenIds } from '../use-owned-tokenids'
import { renderHook, RenderHookResult, waitFor } from '@testing-library/react'
import { Hex } from '@/domain/shared/eth'
import { act } from 'react'

describe('useOwnedTokenIds', () => {
  type HookProps = Parameters<typeof useOwnedTokenIds>
  type HookReturns = ReturnType<typeof useOwnedTokenIds>

  type OwnedTokenIdsHook = RenderHookResult<HookReturns, HookProps>

  const TOKEN_IDS = [1n, 2n, 3n]

  const renderHookWith = ({
    collection = '0xabc' as Hex,
    account = '0x123' as Hex,
    readMock = vi.fn(),
  }: {
    collection?: Hex
    account?: Hex
    readMock?: Mock<(collection: Hex, account: Hex) => Promise<bigint[]>>
  } = {}) => renderHook(() => useOwnedTokenIds(collection, account, readMock))

  describe('mount', () => {
    it('auto fetches on mount when inputs are valid', async () => {
      const readMock = vi.fn().mockResolvedValue([])

      renderHookWith({ readMock })

      await waitFor(() => expect(readMock).toHaveBeenCalled())
    })
  })

  const getHookMember = <K extends keyof HookReturns>(hook: OwnedTokenIdsHook, member: K) =>
    hook.result.current[member]

  const getRefetch = (hook: OwnedTokenIdsHook) => getHookMember(hook, 'refetch')
  const getIds = (hook: OwnedTokenIdsHook) => getHookMember(hook, 'ids')

  describe('refetch', () => {
    it.each([
      ['collection', undefined as Hex | undefined, '0xaccount' as Hex],
      ['account', '0xcollection' as Hex, undefined as Hex | undefined],
    ])('does nothing when %s is undefined', async (_, collection, account) => {
      const readMock = vi.fn()
      const hook = renderHook(() => useOwnedTokenIds(collection, account, readMock))

      await getRefetch(hook)()

      expect(readMock).not.toHaveBeenCalled()
    })

    it('fetches and sets owned token ids', async () => {
      const hook = renderHookWith({ readMock: vi.fn().mockResolvedValue(TOKEN_IDS) })

      const refetch = getRefetch(hook)
      await act(() => refetch())

      expect(getIds(hook)).toEqual(TOKEN_IDS)
    })

    it('sets isFetching while fetching and resets after', async () => {
      // readMock returns a pending promise — we grab resolve as finishFetch
      // so we control exactly when the fetch completes
      let finishFetch: (v: bigint[]) => void
      const readMock = vi.fn(() => new Promise<bigint[]>(resolve => (finishFetch = resolve)))

      const hook = renderHookWith({ readMock })

      // mount fired the fetch, promise is still pending → isFetching is true
      expect(getHookMember(hook, 'isFetching')).toBe(true)

      // finish the promise → hook resumes → setIsFetching(false)
      // When act receives a function that returns a Promise, it waits for it.
      // When it receives a function returning void, it doesn't wait for anything
      // — so the state updates from the resolved Promise never flush.
      // Adding async makes the function return a Promise (even though it resolves immediately),
      await act(async () => finishFetch([]))

      expect(getHookMember(hook, 'isFetching')).toBe(false)
    })

    it('calls readOwned with correct params', () => {
      const readMock = vi.fn().mockResolvedValue([])

      const hook = renderHookWith({ collection: '0xmyC', account: '0xmyA', readMock })

      const refetch = getRefetch(hook)
      refetch()

      expect(readMock).toHaveBeenCalledWith('0xmyC', '0xmyA')
    })
  })
})
