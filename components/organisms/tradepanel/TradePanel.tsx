import { useEffect, useState } from 'react'
import { CreditCard, Layers } from 'lucide-react'

import { ListingDetails } from './ListingDetails'
import { ListingDTO } from '@/lib/dmrkt-indexer/types/listing'
import { useTokenURI, useFillOrder } from '@/lib/blockchain'
import { getImageFromTokenURI } from '@/lib/utils/image'
import { Modal } from '@/components/atoms'
import { NFTSelectForm } from '@/components/molecules'

type Props = {
  listing: ListingDTO | null
}

export function TradePanel({ listing }: Props) {
  // UI elements
  const [previewSrc, setPreviewSrc] = useState<string>('/placeholders/token-waiting.svg')

  // collection bid feature
  const [showNFTSelectModal, setShowNFTSelectModal] = useState<boolean>(false)
  const [tokenIdCb, setTokenIdCb] = useState<bigint | undefined>(undefined)

  // chain interaction stuff
  const { simulation, execution } = useFillOrder(listing?.rawOrder, tokenIdCb)

  const { data: tokenURI, isLoading } = useTokenURI(
    listing
      ? {
          chainId: listing.chainId,
          address: listing.collectionMeta!.address,
          tokenId: BigInt(listing.tokenId),
        }
      : undefined
  )

  useEffect(() => {
    if (!tokenURI) return

    const preview = async () => {
      const image = getImageFromTokenURI(tokenURI)
      setPreviewSrc(image)
    }
    preview()
  }, [tokenURI])

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
    <div className="flex flex-col gap-3 h-full">
      {/* preview */}
      <div className="card shrink-0 flex justify-center overflow-hidden">
        <img src={previewSrc} className="w-full object-cover" alt="token preview" />
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
          <NFTSelectForm
            chainId={listing.chainId}
            collection={{ address: listing.collection, symbol: listing.collectionMeta?.symbol }}
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
