import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { Tag } from 'lucide-react'

import { Hex } from '@/domain/shared/eth'
import { useOwnedTokenIds } from '@/features/browse/hooks/use-owned-tokenids'
import { OrderCore, OrderSide } from '@/protocol/eip712'
import { Modal } from '@/ui/atoms'

import { AskFlow } from './AskFlow'
import { FormInput } from './OrderForm'
import { useNFTPage } from '../hooks/use-nft-page'
import { useCreateOrder } from '../hooks/use-create-order'

type AskInput = FormInput & {
  tokenId: string
}

type Props = {
  chainId: number // todo: use this for fetching nfts (prepare for multichain)
  collection: Hex
  onOrderCreated?: (id: string) => void
}

export function CreateAskBtn({ chainId, collection, onOrderCreated }: Props) {
  const { address: user } = useAccount()

  const { refetch, ids } = useOwnedTokenIds(collection, user)
  const { create, canCreate } = useCreateOrder(user)

  // searchbar may add to filters
  const filters = useMemo(() => ({ tokenIds: ids }), [ids])
  const { items: nfts, fetchFirstPage } = useNFTPage(filters)

  async function wrapAndSign(input: AskInput) {
    if (!user) return

    const order: OrderCore = {
      side: OrderSide.ASK,
      isCollectionBid: false,
      actor: user,
      collection,
      currency: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      nonce: Date.now().toString(),
      ...input,
    }

    try {
      const id = await create(order)
      onOrderCreated?.(id)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!ids || ids.length === 0) return
    fetchFirstPage()
  }, [ids, fetchFirstPage])

  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <>
      <button
        disabled={!canCreate}
        onClick={() => setShowModal(true)}
        className="btn btn-accent h-[27px]"
      >
        <Tag size={16} />
        <span className="px-2">sell stuff</span>
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <AskFlow nftSelection={nfts} onConfirm={input => wrapAndSign(input)} />
      </Modal>
    </>
  )
}
