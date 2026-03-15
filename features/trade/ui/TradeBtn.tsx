'use client'

import { useState } from 'react'
import { CreditCard, Layers } from 'lucide-react'

import type { Listing } from '@/domain/listing'
import { useFillOrder } from '../hooks/fill-order'

import { NFTPreview } from '@/features/explore/ui/NFTPreview'
import { CbFillMenu } from './CbFillMenu'
import { ListingDetails } from './ListingDetails'

import { Modal } from '@/ui/atoms'
import { Order, orderType } from '@/protocol/eip712'
import { useTradeValidation } from '../hooks/trade-validation.use'

type Props = {
  listing: Listing | null
  disabled: boolean
}

export function TradeBtn({ listing, disabled }: Props) {
  // collection bid feature
  const [showModal, setShowModal] = useState<boolean>(false)
  const [tokenIdCb, setTokenIdCb] = useState<bigint | undefined>(undefined)

  // chain interaction stuff
  const { txStatus, fillOrder } = useFillOrder(listing?.rawOrder, tokenIdCb)
  const sim = useTradeValidation(listing?.rawOrder, tokenIdCb)

  const handlePrimaryAction = () => {
    if (!listing) return

    if (listing.isCollectionBid) {
      setShowModal(true)
    } else {
      fillOrder()
    }
  }

  if (!listing) {
    return <div>No listing</div>
  }

  return (
    <>
      <button disabled={disabled} onClick={handlePrimaryAction} className="btn btn-primary">
        {listing.isCollectionBid ? (
          <>
            <Layers size={16} /> select nft
          </>
        ) : (
          <>
            <CreditCard size={16} /> buy now
          </>
        )}
      </button>
      {/* <span className="text-xs text-muted">
          {listing.isCollectionBid
            ? 'choose nft to sell into this bid'
            : 'wallet will ask you to confirm'}
    

      {/* MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col gap-2">
          <CbFillMenu
            chainId={listing.chainId}
            collection={listing.collection}
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
