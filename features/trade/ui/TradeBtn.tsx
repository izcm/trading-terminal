'use client'

import { useState } from 'react'
import { CreditCard, Layers } from 'lucide-react'

import type { Listing } from '@/domain/listing'

import { Modal } from '@/ui/atoms'

import { useTradeValidation } from '../hooks/use-trade-validation'
import { useFillOrder } from '../hooks/use-fill-order'

import { CbFillMenu } from './CbFillMenu'
import { useAccount } from 'wagmi'

type Props = {
  listing: Listing | null
}

/**
 *
 * @param disabled value allows parent to disable trade feature
 */
export function TradeBtn({ listing }: Props) {
  const { address: user } = useAccount()

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

  if (!listing || !user) {
    return (
      <button disabled={true} className="">
        nobody is connected
      </button>
    )
  }

  const isDisabled = !sim.isFillable && !listing.isCollectionBid

  return (
    <>
      <button disabled={isDisabled} onClick={handlePrimaryAction} className="btn btn-primary">
        {listing.isCollectionBid ? (
          <>
            <Layers size={16} />
            <span>Select nft</span>
          </>
        ) : (
          <>
            <CreditCard size={16} />
            <span>Buy loot</span>
          </>
        )}
      </button>

      {/* MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col gap-2">
          <CbFillMenu
            chainId={listing.chainId}
            collection={listing.collection}
            user={user}
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
