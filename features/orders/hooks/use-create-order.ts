import { useCallback } from 'react'
import { useSignTypedData } from 'wagmi'

import { dmrktDomain, eip712Types, OrderCore, toOrder712 } from '@/protocol/eip712'
import { postDmrktOrder } from '@/lib/dmrkt-indexer/actions/dmrkt.post'

export function useCreateOrder() {
  const { signTypedDataAsync } = useSignTypedData()

  const create = useCallback(
    async (order: OrderCore) => {
      const order712 = toOrder712(order)

      const sig = await signTypedDataAsync({
        types: eip712Types,
        primaryType: 'Order',
        message: order712,
        domain: dmrktDomain,
      })

      const res = await postDmrktOrder(dmrktDomain.chainId, order, sig)

      if (!res.ok) {
        throw new Error(res.error ?? `failed to create order`)
      }

      return (res.data as { id: string }).id
    },
    [signTypedDataAsync]
  )

  return { create }
}
