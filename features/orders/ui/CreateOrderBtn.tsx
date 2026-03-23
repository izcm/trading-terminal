import { useCallback, useState } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'

import { OrderCore, toOrder712, eip712Types, dmrktDomain } from '@/protocol/eip712'

import { Hex } from '@/domain/shared/eth'
import { Modal } from '@/ui/atoms'

import { CreateOrderMenu } from './CreateOrderMenu'
import { postDmrktOrder } from '@/lib/dmrkt-indexer/actions/dmrkt.post'
import { useOwnedNFTs } from '@/features/hooks/owned-tokenids.use'
import { NFT } from '@/domain/nft'
import { getDmrktNFTs } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

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
  onOrderCreated?: (id: string) => void
}

function useNFTPage(filters: Record<string, string[]>) {
  const [items, setItems] = useState<NFT[]>([])
  const [cursor, setCursor] = useState<string | null>(null)

  const fetchPage = useCallback(async () => {
    const res = await getDmrktNFTs({ ...filters, cursor })

    if (!res.ok) return

    setItems(prev => [...prev, ...res.data.items])
    setCursor(res.data.cursor)
  }, [filters, cursor])

  return { items, fetchPage, cursor }
}

export function CreateOrderBtn({ chainId, collection, onOrderCreated }: Props) {
  const { address: user } = useAccount()
  // const { nfts, refetch } = useNFTPage(collection, user)

  const { signTypedDataAsync } = useSignTypedData()

  const [showModal, setShowModal] = useState<boolean>(false)

  if (!user) return <button disabled className="btn btn-accent h-[27px]"></button>

  async function askForSignature(order: OrderCore) {
    const order712 = toOrder712(order)

    const sig = await signTypedDataAsync({
      types: eip712Types,
      primaryType: 'Order',
      message: order712,
      domain: dmrktDomain,
    })

    const res = await postDmrktOrder(order, sig)

    if (!res.ok) {
      console.error(res.error)
      return
    }

    // nb: can also check res.status if 201 ? order created : order already existed
    const id = res.data.id as string

    onOrderCreated?.(id)
  }

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
          onConfirm={order => askForSignature(order)}
        />
      </Modal>
    </div>
  )
}
