import { useCallback } from 'react'
import { useSignTypedData } from 'wagmi'

import { Hex } from '@/domain/shared/eth'
import { dmrktDomain, eip712Types, OrderCore, toOrder712 } from '@/protocol/eip712'
import { postDmrktOrder } from '@/lib/dmrkt-indexer/actions/dmrkt.post'

export function useCreateOrder(user?: Hex) {
  const { signTypedDataAsync } = useSignTypedData()

  const canCreate = !!user

  const create = useCallback(
    async (order: OrderCore) => {
      if (!user) throw new Error('no wallet')

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

      return res.data.id as string
    },
    [signTypedDataAsync, user]
  )

  return { create, canCreate }
}
