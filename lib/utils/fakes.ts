import type { Listing } from '@/domain/listing'
import type { TabCtx } from '@/features/tab-config'
import { OrderCore, OrderSide } from '@/protocol/eip712'

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

export const fakeOrderCore = (overrides: Partial<OrderCore> = {}): OrderCore => ({
  side: OrderSide.ASK,
  actor: '0x0000000000000000000000000000000000000001',
  isCollectionBid: false,
  collection: '0x0000000000000000000000000000000000000002',
  tokenId: '1',
  price: '1000000000000000000',
  currency: '0x0000000000000000000000000000000000000003',
  start: 0,
  end: 9999999999,
  nonce: '1',
  ...overrides,
})
