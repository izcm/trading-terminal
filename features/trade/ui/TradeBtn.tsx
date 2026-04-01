'use client'

import { useState } from 'react'
import { CreditCard, Handshake, Layers, Slash, X } from '@/ui/icons'

import type { Listing } from '@/domain/listing'

import { useWallet } from '@/features/wallet/hooks/use-wallet'

import { useFillOrder } from '../hooks/use-fill-order'

type Props = {
  listing: Listing
}

export function TradeBtn({ listing }: Props) {
  const { account } = useWallet()

  // chain interaction stuff
  const { fill: fillOrder, isFillable, isChecking } = useFillOrder(listing?.rawOrder, listing?.id)

  const handlePrimaryAction = () => {
    if (!listing) return

    fillOrder()
  }

  if (!account) {
    return (
      <button disabled={true} className="btn btn-primary">
        no wallet
      </button>
    )
  }

  const isDisabled = listing.status !== 'active' || !isFillable || isChecking

  const content = !isFillable
    ? { icon: <X size={16} />, label: 'Not fillable' }
    : listing.status !== 'active'
      ? { icon: <Slash size={16} />, label: `${listing.status}` }
      : listing.type === 'ask'
        ? { icon: <CreditCard size={16} />, label: 'Buy loot' }
        : { icon: <Handshake size={16} />, label: 'Fill bid' }

  return (
    <>
      <button
        onClick={handlePrimaryAction}
        disabled={isDisabled || listing.isCollectionBid} // collectionBid feature is paused
        className="btn btn-primary"
      >
        {content.icon}
        <span className="px-1">{content.label}</span>
      </button>
    </>
  )
}
