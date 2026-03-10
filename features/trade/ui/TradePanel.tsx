'use client'

import { useState } from 'react'
import { CreditCard, Layers } from 'lucide-react'

import { useFillOrder } from '../hooks/fill-order.use'
import type { Listing } from '@/lib/dmrkt-indexer/types/listing'

import { Modal } from '@/ui/atoms'
import { NFTSelect } from './NFTSelect'

import { ListingDetails } from './ListingDetails'
import { NFTSummary } from '../../../ui/organisms/NFTSummary'

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
    <div className="flex flex-col gap-2 h-full">
      {/* preview */}
      <div className="card">
        <NFTSummary
          chainId={listing.chainId}
          address={listing.collection}
          tokenId={listing.tokenId}
        />
      </div>
      <div className="flex flex-col gap-2 my-1">
        <button
          disabled={!simulation.isFillable && !listing.isCollectionBid}
          onClick={handlePrimaryAction}
          className="btn btn-primary w-full"
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

        <span className="text-xs text-muted">
          {listing.isCollectionBid
            ? 'choose nft to sell into this bid'
            : 'wallet will ask you to confirm'}
        </span>
      </div>

      {/* details area */}
      <ListingDetails listing={listing} />

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
