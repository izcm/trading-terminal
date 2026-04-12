import { describe, it, expect } from 'vitest'
import {
  denormalizeKeys,
  FIELD_ALIASES,
  normalizeKeys,
  REVERSE_FIELD_ALIASES,
} from '../param-mapper'

describe('normalizeKeys', () => {
  it.each(Object.entries(FIELD_ALIASES))('maps %s -> %s', (alias, key) => {
    expect(normalizeKeys({ [alias]: ['x'] })).toEqual({ [key]: ['x'] })
  })

  it('does not touch unknown keys', () => {
    expect(normalizeKeys({ abc123: ['x'] })).toEqual({ abc123: ['x'] })
  })
})

describe('denormalizeKeys', () => {
  it.each(Object.entries(REVERSE_FIELD_ALIASES))('maps %s -> %s', (key, alias) => {
    expect(denormalizeKeys(`${key}=x`)).toBe(`${alias}=x`)
  })
})
