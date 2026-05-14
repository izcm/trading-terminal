import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useTheme } from '../use-theme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  function setup() {
    const hook = renderHook(() => useTheme())

    return {
      hook,
      getTheme: () => hook.result.current.theme,
      applyTheme: hook.result.current.applyTheme,
    }
  }

  describe('mount', () => {
    it('defaults to runtime theme when storage is empty', () => {
      const { getTheme } = setup()
      expect(getTheme()).toBe('runtime')
    })

    it('restores theme from storage on mount', () => {
      localStorage.setItem('theme', 'favourite')

      const { getTheme } = setup()
      expect(getTheme()).toEqual('favourite')
    })
  })

  describe('applyTheme', () => {
    // nb: spies are restored automatically via restoreMocks in vitest config

    it('sets data-theme attribute on document', () => {
      const spy = vi.spyOn(document.documentElement, 'setAttribute')

      const { applyTheme } = setup()
      applyTheme('fresh')

      expect(document.documentElement.getAttribute('data-theme')).toBe('fresh')
      expect(spy).toHaveBeenCalledWith('data-theme', 'fresh')
    })

    it('persists theme to localStorage', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem')

      const { applyTheme } = setup()
      applyTheme('fresh')

      expect(localStorage.getItem('theme')).toBe('fresh')
      expect(spy).toHaveBeenCalledWith('theme', 'fresh')
    })
  })
})
