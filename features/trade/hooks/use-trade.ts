import { useState } from 'react'

import { Listing } from '@/domain/listing'

import { useFillOrder } from './use-fill-order'
import { useTradeValidation } from './use-trade-validation'

// NB: **collection bid feature is paused**

export function useTrade(listing: Listing) {
  const {
    fill: fillOrder,
    isFillable,
    isChecking,
    error,
  } = useFillOrder(listing?.rawOrder, listing?.id)

  const isDisabled =
    listing.status !== 'active' || (!isFillable && !listing.isCollectionBid) || isChecking

  return {
    fillOrder,
    isFillable,
  }
}
