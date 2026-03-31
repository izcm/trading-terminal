'use client'

import { useState } from 'react'
import { CreditCard, Handshake, Layers, Slash, X } from '@/ui/icons'

import type { Listing } from '@/domain/listing'

import { Modal } from '@/ui/atoms'

import { useWallet } from '@/features/wallet/hooks/use-wallet'

import { useTradeValidation } from '../hooks/use-trade-validation'
import { useFillOrder } from '../hooks/use-fill-order'
import { CbFillMenu } from './CbFillMenu'

type Props = {
  listing: Listing
}

export function TradeBtn({ listing }: Props) {
  const { account } = useWallet()

  // modal for selecting token to put into collection bid
  const [showModal, setShowModal] = useState<boolean>(false)
  const [tokenIdCb, setTokenIdCb] = useState<bigint | undefined>(undefined)

  // chain interaction stuff
  const { fillOrder } = useFillOrder(listing?.rawOrder, listing?.id, tokenIdCb)
  const sim = useTradeValidation(listing?.rawOrder, tokenIdCb)

  const handlePrimaryAction = () => {
    if (!listing) return

    if (listing.isCollectionBid) {
      setShowModal(true)
    } else {
      fillOrder()
    }
  }

  if (!account) {
    return (
      <button disabled={true} className="btn btn-primary">
        no wallet
      </button>
    )
  }

  const isPending = sim.checking || sim.error === 'pending'

  const isDisabled =
    listing.status !== 'active' || (!sim.isFillable && !listing.isCollectionBid) || isPending

  const content =
    listing.status !== 'active'
      ? { icon: <Slash size={16} />, label: `${listing.status}` }
      : !sim.isFillable && !listing.isCollectionBid
        ? { icon: <X size={16} />, label: 'Not fillable' }
        : listing.isCollectionBid
          ? { icon: <Layers size={16} />, label: 'Select nft' }
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

      {/* MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col gap-2">
          <CbFillMenu
            chainId={listing.chainId}
            collection={listing.collection}
            user={account}
            validation={{
              canConfirm: sim.isFillable,
              checking: sim.checking,
              error: sim.error,
            }}
            onValidate={(tid: bigint) => setTokenIdCb(tid)}
            onConfirm={() => {
              fillOrder()
              setShowModal(false)
            }}
          />
        </div>
      </Modal>
    </>
  )
}
