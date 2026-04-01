import { Gavel, Tag } from '@/ui/icons'
import { parseEther } from 'viem' // todo: decouple here

import { OrderCore, OrderSide } from '@/protocol/eip712'
import { Hex } from '@/domain/shared/eth'

import { toast } from '@/ui/organisms/core/Toast'

import { useWallet } from '@/features/wallet/hooks/use-wallet'
import { FormInput, OrderForm } from './OrderForm'
import { useCreateOrder } from '../hooks/use-create-order'

type Props = {
  collection: Hex
  tokenId: bigint
  side: OrderSide
  onOrderCreated?: (id: string) => void
}

const btnAttr = {
  [OrderSide.ASK]: {
    txt: 'Sell loot',
    icon: <Tag size={16} />,
  },
  [OrderSide.BID]: {
    txt: 'Make offer',
    icon: <Gavel size={16} />,
  },
} as const

export function CreateOrderFlow({ collection, tokenId, side, onOrderCreated }: Props) {
  const { account } = useWallet()
  const { canCreate, create } = useCreateOrder(account)

  async function wrapAndSign(input: FormInput) {
    if (!account) return

    const order: OrderCore = {
      side,
      isCollectionBid: false, // feature is paused
      actor: account,
      collection,
      tokenId: tokenId.toString(),
      currency: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      nonce: Date.now().toString(),
      ...input,
      price: parseEther(input.price).toString(),
    }

    try {
      const id = await create(order)
      console.log(id)

      toast({
        title: 'Order Created',
        description: 'Your signed order is stored at dmrkt. The marketplace should update shortly.',
        variant: 'success',
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
