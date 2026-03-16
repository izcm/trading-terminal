import { useState } from 'react'
import { useAccount } from 'wagmi'

import { Hex } from '@/domain/shared/eth'
import { OwnedNFTPicker } from '@/features/OwnedNFTPicker'
import { Modal } from '@/ui/atoms'
import { CreateOrderMenu } from './CreateOrderMenu'
import { Order, OrderCore } from '@/protocol/eip712'

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
  const [order, setOrder] = useState<OrderCore | undefined>(undefined)

  if (!user) return <button disabled className="btn btn-accent h-[27px]"></button>

  return (
    <div>
      <button onClick={() => setShowModal(true)} className="btn btn-accent h-[27px]">
        + new order
      </button>
      {/* MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <CreateOrderMenu
          chainId={chainId}
          collection={collection}
          user={user}
          onConfirm={() => alert('hello')}
        />
      </Modal>
    </div>
  )
}
