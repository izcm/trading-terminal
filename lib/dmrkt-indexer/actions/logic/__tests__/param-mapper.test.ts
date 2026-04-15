import { describe, it, expect } from 'vitest'
import { FIELD_ALIASES, normalizeKeys, resolveValue, toSearchParams } from '../param-mapper'

describe('normalizeKeys', () => {
  it.each(Object.entries(FIELD_ALIASES))('maps %s -> %s', (alias, key) => {
    expect(normalizeKeys({ [alias]: ['x'] })).toEqual({ [key]: ['x'] })
  })

  it('does not touch unknown keys', () => {
    expect(normalizeKeys({ abc123: ['x'] })).toEqual({ abc123: ['x'] })
  })
})

describe('resolveValue', () => {
  it('maps a known alias (ask -> 0)', () => {
    const resolved = resolveValue('side', 'ask')
    expect(resolved).toBe('0')
  })

  it.each([
    ['side', 'ask', '0'],
    ['side', 'bid', '1'],
  ])('maps %s %s to %s', (a, b, expected) => {
    const resolved = resolveValue(a, b)
    expect(resolved).toBe(expected)
  })

  it('returns the value unchanged for an unknown key', () => {
    const resolved = resolveValue('foo', 'bar')
    expect(resolved).toBe('bar')
  })

  it('returns the value unchanged for a known key but unknown alias', () => {
    const resolved = resolveValue('side', 'foo')
    expect(resolved).toBe('foo')
  })
})

describe('toSearchParams', () => {
  describe('regular fields', () => {
    it('appends a single key=value pair', () => {
      const params = toSearchParams({ status: ['active'] })

      expect(params.has('status')).toBe(true)
      expect(params.getAll('status')).toEqual(['active'])
    })

    it('appends multiple values for the same key as repeated params', () => {
      const params = toSearchParams({ status: ['active', 'cancelled'] })
      const values = params.getAll('status')

      expect(values).toHaveLength(2)
      expect(values).toEqual(['active', 'cancelled'])
    })

    it('applies value aliases (side=ask -> side=0)', () => {
      const params = toSearchParams({ side: ['ask'] })
      const values = params.getAll('side')
      expect(values).toEqual(['0'])
    })

    it('replaces underscores with spaces in values', () => {
      const params = toSearchParams({ key: ['foo_bar'] })
      const values = params.getAll('key')
      expect(values).toEqual(['foo bar'])
    })

    it('resolves aliased field names via normalizeKeys (maker -> actor)', () => {
      const params = toSearchParams({ maker: ['0xabc123'] })

      expect(params.has('maker')).toBe(false)
      expect(params.has('actor')).toBe(true)

      expect(params.getAll('actor')).toEqual(['0xabc123'])
    })

    it('resolves lowercase field names via resolveFieldName (tokenid -> tokenId)', () => {
      const params = toSearchParams({ tokenid: ['1'] })

      expect(params.has('tokenid')).toBe(false)
      expect(params.has('tokenId')).toBe(true)

      expect(params.getAll('tokenId')).toEqual(['1'])
    })

    it('returns empty params for an empty input', () => {
      const params = toSearchParams({})
      expect(params.toString()).toEqual('')
    })
  })
})

describe('trait fields', () => {
  it('converts trait.color=value into format expected by API (eg. trait=Color & value=Blue)', () => {
    const params = toSearchParams({ 'trait.color': ['blue'] })

    expect(params.has('trait.color')).toBe(false)
    expect(params.has('trait')).toBe(true)

    expect(params.getAll('trait')).toEqual(['Color'])
    expect(params.getAll('value')).toEqual(['Blue'])
  })

  it('capitalizes and spaces trait value (aqua_mint -> Aqua Mint)', () => {
    const params = toSearchParams({ 'trait.color': ['aqua_mint'] })
    expect(params.getAll('value')).toEqual(['Aqua Mint'])
  })

  it('joins multiple trait values into comma-separated format value=value1,value2', () => {
    const params = toSearchParams({ 'trait.color': ['blue', 'red', 'yellow'] })
    expect(params.getAll('value')).toEqual(['Blue,Red,Yellow'])
  })

  it('handles trait and regular filters together', () => {
    const params = toSearchParams({ 'trait.color': ['blue'], status: ['active'] })

    expect(params.getAll('trait')).toEqual(['Color'])
    expect(params.getAll('value')).toEqual(['Blue'])
    expect(params.getAll('status')).toEqual(['active'])
  })
})
