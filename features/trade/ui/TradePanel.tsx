'use client'

import { useState } from 'react'
import { CreditCard, Layers } from 'lucide-react'

import type { Listing } from '@/domain/listing'
import { useFillOrder } from '../hooks/fill-order.use'

import { NFTSelect } from './NFTSelect'
import { ListingDetails } from './ListingDetails'
import { NFTPreview } from '../../explore/ui/NFTPreview'

import { Modal } from '@/ui/atoms'
import { NFTCard } from '@/ui/organisms/NFTCard'

type Props = {
  listing: Listing | null
}

export function TradePanel({ listing }: Props) {
  // collection bid feature
  const [showNFTSelectModal, setShowNFTSelectModal] = useState<boolean>(false)
  const [tokenIdCb, setTokenIdCb] = useState<bigint | undefined>(undefined)

  // chain interaction stuff
  const { simulation, execution } = useFillOrder(listing?.rawOrder, tokenIdCb)

  const handlePrimaryAction = () => {
    if (!listing) return

    if (listing.isCollectionBid) {
      setShowNFTSelectModal(true)
    } else {
      execution.fill()
    }
  }

  if (!listing) {
    return <div>No listing</div>
  }

  return (
    <div className="flex flex-col gap-4 h-full ">
      {/* preview */}
      <div className="pointer-events-none">
        <NFTPreview
          chainId={listing.chainId}
          address={listing.collection}
          tokenId={listing.tokenId}
        />
      </div>

      <button
        disabled={!simulation.isFillable && !listing.isCollectionBid}
        onClick={handlePrimaryAction}
        className="btn btn-secondary"
      >
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

      {/* details area */}
      <div className="flex-1 card bg-secondary">
        <ListingDetails listing={listing} />
      </div>

      {/* <span className="text-xs text-muted">
          {listing.isCollectionBid
            ? 'choose nft to sell into this bid'
            : 'wallet will ask you to confirm'}
    

      {/* MODAL */}
      <Modal isOpen={showNFTSelectModal} onClose={() => setShowNFTSelectModal(false)}>
        <div className="flex flex-col gap-2 w-[300px] max-w-[600px]">
          <NFTSelect
            chainId={listing.chainId}
            collection={{ address: listing.collection, symbol: listing.nftCollection?.symbol }}
            validation={{
              canConfirm: simulation.isFillable,
              checking: simulation.checking,
              error: simulation.error,
            }}
            onValidate={(tid: bigint) => setTokenIdCb(tid)}
            onConfirm={() => {
              execution.fill()
              setShowNFTSelectModal(false)
            }}
          />
          <button className="btn btn-secondary" onClick={() => setShowNFTSelectModal(false)}>
            cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}
