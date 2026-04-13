import { describe, it, expect } from 'vitest'
import { FIELD_ALIASES, normalizeKeys } from '../param-mapper'

describe('normalizeKeys', () => {
  it.each(Object.entries(FIELD_ALIASES))('maps %s -> %s', (alias, key) => {
    expect(normalizeKeys({ [alias]: ['x'] })).toEqual({ [key]: ['x'] })
  })

  it('does not touch unknown keys', () => {
    expect(normalizeKeys({ abc123: ['x'] })).toEqual({ abc123: ['x'] })
  })
})
