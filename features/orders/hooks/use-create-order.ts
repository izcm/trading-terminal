import { useCallback } from 'react'
import { useSignTypedData } from 'wagmi'
import { Hex, parseEther } from 'viem'

import { usePublicClient } from '@/lib/blockchain/hooks/use-public-client'

import { dmrktDomain, eip712Types, OrderSide, toOrder712 } from '@/protocol/eip712'

import { postDmrktOrder } from '@/lib/dmrkt-indexer/actions/dmrkt.post'

import { getChainConfig } from '@/lib/blockchain/wagmi'
import { getBlockTimestamp } from '@/lib/blockchain'
import { WrongNetworkError } from '@/lib/blockchain/errors'

import { useWallet } from '@/features/wallet/hooks/use-wallet'

export function useCreateOrder() {
  const { signTypedDataAsync } = useSignTypedData()
  const { chainId, account } = useWallet()

  const chain = chainId ? getChainConfig(chainId) : undefined
  const client = usePublicClient({ chainId: chain?.id })

  const create = useCallback(
    async (side: OrderSide, collection: Hex, tokenId: bigint, price: string, end: number) => {
      if (!chain || !client || !account) throw new WrongNetworkError('create order')

      // block timestamp for dev, since no blocks are mined in background
      const now = await getBlockTimestamp(client)

      const order = {
        side,
        isCollectionBid: false, // feature is paused
        actor: account,
        collection,
        tokenId: tokenId.toString(),
        currency: chain.weth,
        nonce: Date.now().toString(),
        start: now,
        end,
        price: parseEther(price).toString(),
      }

      const sig = await signTypedDataAsync({
        types: eip712Types,
        primaryType: 'Order',
        message: toOrder712(order),
        domain: dmrktDomain(BigInt(chain.id), chain.marketplace),
      })

      const res = await postDmrktOrder(chain.id, order, sig)

      if (!res.ok) {
        throw new Error(res.error ?? `failed to create order`)
      }

      return (res.data as { id: string }).id
    },
    [signTypedDataAsync]
  )

  return { create }
}
