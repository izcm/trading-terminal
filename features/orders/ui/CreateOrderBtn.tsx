import { useState } from 'react'
import { useAccount } from 'wagmi'

import { Hex } from '@/domain/shared/eth'
import { OwnedNFTPicker } from '@/features/OwnedNFTPicker'
import { Modal } from '@/ui/atoms'

// asks:
// - show owned tokens in list
// - let user choose from list and set price + timeline
// - call for user to sign => post to backend

// bids:
// - bids can also be made in explore tab select tokens
// - for create order btn bids takes concrete tokenId
// - collection_bids are not implemented yet in contract

// todo first: make + post valid asks

type Props = {
  chainId: number
  collection: Hex
}

export function CreateOrderBtn({ chainId, collection }: Props) {
  const { address: user } = useAccount()

  const [showModal, setShowModal] = useState<boolean>(false)
  const [tokenId, setTokenId] = useState<bigint | undefined>(undefined)

  if (!user) return <button disabled className="btn btn-accent h-[27px]"></button>

  return (
    <div>
      <button onClick={() => setShowModal(true)} className="btn btn-accent h-[27px]">
        + new order
      </button>
      {/* MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="flex flex-col gap-2">
          <OwnedNFTPicker
            chainId={chainId}
            collection={collection}
            user={user}
            selectedTokenId={tokenId}
            onSelect={nft => setTokenId(nft.tokenId)}
          />
          <button className="btn btn-primary">next</button>
        </div>
      </Modal>
    </div>
  )
}
