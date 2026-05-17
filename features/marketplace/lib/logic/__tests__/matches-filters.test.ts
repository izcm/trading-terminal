import { describe, expect, it } from 'vitest'
import { itemMatchesFilters } from '../matches-filters'

describe('itemMatchesFilters', () => {
  it.each([
    [{}, { someKey: [] }, true],
    [{ status: 'active' }, { status: ['active'] }, true],
    [{ status: 'inactive' }, { status: ['active'] }, false],
    [{ tokenId: '2' }, { tokenId: ['1', '2', '3'] }, true],
  ])('matches filters correctly', (item, filters, expected) => {
    expect(itemMatchesFilters(item, filters)).toBe(expected)
  })

  describe('missing keys', () => {
    it('matches when item is missing the filtered key', () => {
      expect(itemMatchesFilters({}, { someKey: ['someValue'] })).toBe(true)
    })
  })

  describe('shouldSkip', () => {
    it('skips sort keys by default', () => {
      expect(itemMatchesFilters({ sortField: 'price' }, { sortField: ['createdAt'] })).toBe(true)
    })

    it('skips key when shouldSkip returns true', () => {
      expect(
        itemMatchesFilters({ status: 'inactive' }, { status: ['active'] }, {}, () => true)
      ).toBe(true)
    })

    it('does not skip key when shouldSkip returns false', () => {
      expect(
        itemMatchesFilters({ status: 'inactive' }, { status: ['active'] }, {}, () => false)
      ).toBe(false)
    })
  })

  describe('aliasMap', () => {
    it('uses alias key when aliasMap is provided', () => {
      expect(
        itemMatchesFilters({ txHash: '0xabc' }, { tx_hash: ['0xabc'] }, { tx_hash: 'txHash' })
      ).toBe(true)
    })
  })
})
