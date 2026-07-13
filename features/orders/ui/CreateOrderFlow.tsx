import { OrderSide } from '@/protocol/eip712'
import type { Hex } from '@/domain/shared/eth'

import { WrongNetworkError } from '@/lib/blockchain/errors'

import { toast } from '@/ui/molecules'
import { FormInput, OrderForm } from './OrderForm'

import { useCreateOrder } from '../hooks/use-create-order'
import { useState } from 'react'

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
  const { create } = useCreateOrder()

  const [approving, setApproving] = useState<boolean>(false)

  async function wrapAndSign(input: FormInput) {
    if (side === OrderSide.ASK) {
      // for asks -> check nft transfer auth
    } else {
      // for bids -> check weth allowance + if user has enough funds
    }

    try {
      const id = await create(side, collection, tokenId, input.price, input.end)

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

      let toastMsg: string | undefined

      toastMsg =
        err instanceof WrongNetworkError
          ? 'Are you connected to the correct network?'
          : 'Something happened, order was not processed.'

      toast({
        title: 'Order Creation Failed',
        description: toastMsg,
        variant: 'error',
      })
    }
  }

  return approving ? <div>hello</div> : <OrderForm tokenId={tokenId} onSubmit={wrapAndSign} />
}
