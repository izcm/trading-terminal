import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Gavel } from 'lucide-react'

import { Hex } from '@/domain/shared/eth'
import { OrderCore, OrderSide } from '@/protocol/eip712'
import { Modal } from '@/ui/atoms'

import { FormInput, OrderForm } from './OrderForm'
import { useCreateOrder } from '../hooks/use-create-order'

type Props = {
  chainId: number // todo: use this to get dmrkt domain for chain x (prepare for multichain)
  collection: Hex
  tokenId: bigint
  onOrderCreated?: (id: string) => void
}

export function CreateOrderBtn({ chainId, collection, tokenId, onOrderCreated }: Props) {
  const { address: user } = useAccount()
  const { create, canCreate } = useCreateOrder(user)

  async function wrapAndSign(input: FormInput) {
    if (!user) return

    const order: OrderCore = {
      side: OrderSide.BID,
      isCollectionBid: false,
      actor: user,
      collection,
      tokenId: tokenId.toString(),
      currency: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      nonce: Date.now().toString(),
      ...input,
    }

    try {
      const id = await create(order)
      onOrderCreated?.(id)
    } catch (err) {
      console.error(err)
    }
  }

  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      <button disabled={!canCreate} onClick={() => setShowModal(true)} className="btn btn-primary">
        <Gavel size={20} />
        <span className="px-1">make offer</span>
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <OrderForm tokenId={tokenId} onSubmit={wrapAndSign} />
      </Modal>
    </>
  )
}
