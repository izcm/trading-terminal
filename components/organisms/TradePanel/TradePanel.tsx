import { useEffect, useState } from 'react'
import { CreditCard } from 'lucide-react'

import { ListingDetails } from './ListingDetails'
import { Listing } from '@/domain/types/listing'
import { useTokenURI } from '@/lib/blockchain/hooks/token-uri.use'
import { useOrderValidation } from '@/lib/blockchain/orderbook/hooks/validate-order.use'
import { getImageFromTokenURI } from '@/lib/utils/image'

type Props = {
  listing: Listing | null
}

export function TradePanel({ listing }: Props) {
  if (!listing) {
    return <div>No listing</div>
  }

  const [previewSrc, setPreviewSrc] = useState<string>('/placeholders/token-waiting.svg')
  const validation = useOrderValidation(listing)

  const { data: tokenURI, isLoading } = useTokenURI({
    chainId: listing.chainId,
    address: listing.collectionMeta!.address,
    tokenId: BigInt(listing.tokenId),
  })

  useEffect(() => {
    if (!tokenURI) return

    const preview = async () => {
      const image = getImageFromTokenURI(tokenURI)
      setPreviewSrc(image)
    }
    preview()
  }, [tokenURI])

  return (
    <>
      {/* preview */}
      <div className="h-64 card shrink-0 flex justify-center overflow-hidden">
        <img src={previewSrc} className="w-full object-cover" alt="token preview" />
      </div>
      <div className="flex flex-col gap-2 my-1">
        <button
          disabled={!validation.isFillable && !listing.isCollectionBid}
          onClick={() => alert('hello')}
          className="btn btn-primary w-full"
        >
          <CreditCard /> buy now
        </button>
        <span className="text-xs text-muted">your wallet will ask you to confirm</span>
      </div>

      {/* details area */}
      <ListingDetails listing={listing} />
    </>
  )
}
