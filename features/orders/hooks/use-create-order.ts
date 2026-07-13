import { useCallback } from 'react'

import { useSignTypedData } from 'wagmi'
import { Address, Hex, parseEther } from 'viem'

import { dmrktDomain, eip712Types, OrderSide, toOrder712 } from '@/protocol/eip712'

import { postDmrktOrder } from '@/lib/dmrkt-indexer/actions/dmrkt.post'
import { NotConnectedError, WrongNetworkError } from '@/lib/blockchain'

export function useCreateOrder(
  chainId: number | undefined,
  marketplace: Address | undefined,
  account: Hex | undefined
) {
  const { signTypedDataAsync } = useSignTypedData()

  const create = useCallback(
    async (
      side: OrderSide,
      collection: Hex,
      tokenId: bigint,
      price: string,
      currency: Address,
      start: number,
      end: number
    ) => {
      if (!account) throw new NotConnectedError('create order')
      if (!chainId || !marketplace) throw new WrongNetworkError('create order')

      const order = {
        side,
        isCollectionBid: false, // feature is paused
        actor: account,
        collection,
        tokenId: tokenId.toString(),
        currency,
        nonce: Date.now().toString(),
        start,
        end,
        price: parseEther(price).toString(),
      }

      const sig = await signTypedDataAsync({
        types: eip712Types,
        primaryType: 'Order',
        message: toOrder712(order),
        domain: dmrktDomain(BigInt(chainId), marketplace),
      })

      const res = await postDmrktOrder(chainId, order, sig)

      if (!res.ok) {
        throw new Error(res.error ?? `failed to create order`)
      }

      return (res.data as { id: string }).id
    },
    [signTypedDataAsync]
  )

  return { create }
}
