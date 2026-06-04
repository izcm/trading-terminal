import { parseEther } from 'viem'

import { dmrktDomain, OrderCore, OrderSide } from '@/protocol/eip712'
import type { Hex } from '@/domain/shared/eth'

import { toast } from '@/ui/molecules'

import { getBlockTimestamp } from '@/lib/blockchain'

import { useWallet } from '@/features/wallet/hooks/use-wallet'
import { FormInput, OrderForm } from './OrderForm'
import { useCreateOrder } from '../hooks/use-create-order'

type Props = {
  collection: Hex
  tokenId: bigint
  side: OrderSide
  onOrderCreated?: (id: string) => void
  onOrderNavigate?: (id: string) => void // toast navigate to order
}

export function CreateOrderFlow({
  collection,
  tokenId,
  side,
  onOrderCreated,
  onOrderNavigate,
}: Props) {
  const { account, chainId: walletChainId } = useWallet()
  const { create } = useCreateOrder()

  async function wrapAndSign(input: FormInput) {
    if (!account) return

    if (walletChainId !== dmrktDomain.chainId) {
      toast({
        title: 'Wrong network',
        description: 'Switch network to continue',
        variant: 'error',
      })
      return
    }

    // block timestamp for dev, since no blockas are mined in background
    const now = await getBlockTimestamp(dmrktDomain.chainId)

    const order: OrderCore = {
      side,
      isCollectionBid: false, // feature is paused
      actor: account,
      collection,
      tokenId: tokenId.toString(),
      currency: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      nonce: Date.now().toString(),
      ...input,
      start: now,
      price: parseEther(input.price).toString(),
    }

    try {
      const id = await create(order)

      toast({
        title: 'Order Created',
        description: 'Your signed order is stored at dmrkt. The marketplace should update shortly.',
        variant: 'success',
        toastAction: onOrderNavigate
          ? { text: 'View order', fn: () => onOrderNavigate(id) }
          : undefined,
      })
      onOrderCreated?.(id)
    } catch (err) {
      console.error(err)
      toast({
        title: 'Order Creation Failed',
        description: `Something happened, order was not processed.`,
        variant: 'error',
      })
    }
  }

  return <OrderForm tokenId={tokenId} onSubmit={wrapAndSign} />
}
