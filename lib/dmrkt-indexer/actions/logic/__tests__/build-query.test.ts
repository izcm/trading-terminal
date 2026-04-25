import { describe, it, expect, vi } from 'vitest'

import { buildQuery } from '../build-query'
import { toSearchParams } from '../param-mapper'

vi.mock('../param-mapper', () => ({
  toSearchParams: vi.fn().mockImplementation(() => new URLSearchParams()),
}))

describe('buildQuery', () => {
  type BuildQueryInput = Parameters<typeof buildQuery>[0]

  const makeBuildInput = (overrides: Partial<BuildQueryInput> = {}): BuildQueryInput => ({
    filters: { foo: ['bar'] },
    ...overrides,
  })

  function buildQueryWith(input: BuildQueryInput = makeBuildInput()) {
    return buildQuery(input)
  }

  describe('cursor', () => {
    it('appends cursor when provided', () => {
      const query = buildQueryWith(makeBuildInput({ cursor: 'cursor_123' }))
      expect(query.getAll('cursor')).toEqual(['cursor_123'])
    })

    it('does not append cursor when null/undefined', () => {
      const query = buildQueryWith()
      expect(query.has('cursor')).toBe(false)
    })
  })

  describe('sortField', () => {
    it('sets default sort field when not provided', () => {
      const query = buildQueryWith()
      expect(query.has('sortField')).toBe(true)
    })

    it('does not override sort field when provided', () => {
      const query = buildQueryWith(makeBuildInput({ filters: { sortField: ['non-default'] } }))
      expect(query.has('sortField')).toBe(false)
    })
  })

  it('calls toSearchParams with provided filters', () => {
    buildQueryWith()
    expect(vi.mocked(toSearchParams)).toHaveBeenCalledWith(makeBuildInput().filters)
  })

  it('appends all includes', () => {
    const includes = ['this', 'and', 'that']
    const query = buildQueryWith(makeBuildInput({ includes }))

    expect(query.getAll('include')).toEqual(includes)
  })
})
