import { ListingStatus } from '@/domain/listing'

export const listingStatusToClass: Record<ListingStatus, string> = {
  active: 'order-active',
  filled: 'order-filled',
  cancelled: 'order-dead',
  expired: 'order-dead',
}
