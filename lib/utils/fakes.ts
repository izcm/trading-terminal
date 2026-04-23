import type { Listing } from '@/domain/listing'
import type { TabCtx } from '@/features/tab-config'

export const fakeListing = (overrides: Partial<Listing> = {}): Listing =>
  ({
    id: '123',
    status: 'active',
    rawOrder: { nonce: 1 },
    ...overrides,
  }) as Listing

export const fakeCtx = (overrides: Partial<TabCtx> = {}): TabCtx => ({
  isMyListing: () => false,
  isMine: () => false,
  ...overrides,
})
