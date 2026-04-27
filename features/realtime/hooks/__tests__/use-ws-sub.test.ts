import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useWsSub } from '../use-ws-sub'

describe('useWsSub', () => {
  describe('mount', () => {
    it('calls subscribe with refs', () => {
      const subscribe = vi.fn()
      renderHook(() => useWsSub({ addItem: () => {}, updateItem: () => {} }, subscribe))

      expect(subscribe).toHaveBeenCalledWith(expect.any(Function), expect.any(Function))
    })
  })

  describe('unmount', () => {
    it('calls cleanup functions', () => {
      // subscribe returns an array of cleanup functions
      const cleanup = vi.fn()
      const subscribe = vi.fn(() => [cleanup])

      const { unmount } = renderHook(() =>
        useWsSub({ addItem: () => {}, updateItem: () => {} }, subscribe)
      )

      unmount()

      expect(cleanup).toHaveBeenCalled()
    })
  })
})
