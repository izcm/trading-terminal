import { useMemo } from 'react'
import { useSimulateContract } from 'wagmi' // todo: decouple
import { Address } from 'viem'

import { Order, toOrder712 } from '@/protocol/eip712'
import { orderbookAbi, orderbookAddress } from '@/protocol/config'

import { ozErc721Errors } from '@/lib/blockchain'

export function useTradeSimulation(user?: Address, order?: Order, tokenIdCb?: bigint) {
  const enabled = !!order && !!user && (!order.isCollectionBid || tokenIdCb !== undefined)

  const args = useMemo(() => {
    if (!order || !user) return undefined

    const { signature, ...orderCore } = order

    const order712 = toOrder712(orderCore)
    const tokenIdFill = order.isCollectionBid ? tokenIdCb : order.tokenId

    return [{ tokenId: tokenIdFill, actor: user }, order712, signature] as const
  }, [order, user, tokenIdCb])

  const sim = useSimulateContract({
    abi: [...orderbookAbi, ...ozErc721Errors],
    address: orderbookAddress! as Address,
    functionName: 'settle',
    account: user,
    args,
    query: {
      enabled,
    },
  })

  return sim
}
