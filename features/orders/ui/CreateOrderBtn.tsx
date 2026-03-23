import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'

import { OrderCore, toOrder712, eip712Types, dmrktDomain } from '@/protocol/eip712'

import { Hex } from '@/domain/shared/eth'
import { Modal } from '@/ui/atoms'

import { CreateOrderMenu } from './CreateOrderMenu'
import { postDmrktOrder } from '@/lib/dmrkt-indexer/actions/dmrkt.post'
import { NFT } from '@/domain/nft'
import { getDmrktNFTs } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'
import { useOwnedTokenIds } from '@/features/inventory/hooks/owned-tokenids.use'

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
  const [initialLoading, setInitialLoading] = useState<boolean>(false)

  // --- first page (reset + load)
  const fetchFirstPage = useCallback(async () => {
    setInitialLoading(true)

    const res = await getDmrktNFTs({ ...filters, cursor: null })
    if (res.ok) {
      setItems(res.data.items)
      setCursor(res.data.cursor ?? null)
    }

    setInitialLoading(false)
  }, [filters])

  // --- next page (append)
  const fetchNextPage = useCallback(async () => {
    if (!cursor) return

    const res = await getDmrktNFTs({ ...filters, cursor })
    if (res.ok) {
      setItems(prev => [...prev, ...res.data.items])
      setCursor(res.data.cursor ?? null)
    }
  }, [filters, cursor])

  return {
    items,
    cursor,
    initialLoading,
    fetchFirstPage,
    fetchNextPage,
  }
}

export function CreateOrderBtn({ chainId, collection, onOrderCreated }: Props) {
  const { address: user } = useAccount()

  const { ids, refetch } = useOwnedTokenIds(collection, user)
  console.log(ids)

  const filters = useMemo(() => ({ tokenIds: ids }), [ids])
  const { items: nfts, fetchFirstPage } = useNFTPage(filters)

  useEffect(() => {
    if (!ids || ids.length === 0) return
    fetchFirstPage()
  }, [ids, fetchFirstPage])

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
        <CreateOrderMenu ownedNFTs={nfts} user={user} onConfirm={order => askForSignature(order)} />
      </Modal>
    </div>
  )
}
