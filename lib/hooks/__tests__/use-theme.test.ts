import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, RenderHookResult } from '@testing-library/react'

import { useTheme } from '../use-theme'

describe('useTheme', () => {
  function setup() {
    const hook = renderHook(() => useTheme())

    return {
      hook,
      getTheme: () => hook.result.current.theme,
      getSetTheme: () => hook.result.current.setTheme,
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

  describe('apply', () => {
    it('sets data-theme attribute on document')
    it('persists theme to localStorage')
  })
})
