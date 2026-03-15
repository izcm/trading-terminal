import { useMemo } from 'react'
import { useAccount, useSimulateContract } from 'wagmi'

import { Order, toOrder712 } from '@/protocol/eip712'
import { orderbookAbi, orderbookAddress } from '@/protocol/config'
import { Hex } from 'viem'
import { ozErc721Errors } from '@/lib/blockchain'

export function useTradeSimulation(order?: Order, tokenIdCb?: bigint) {
  const { address } = useAccount()

  const enabled = !!order && !!address && (!order.isCollectionBid || tokenIdCb !== undefined)

  const args = useMemo(() => {
    if (!order || !address) return undefined

    const { signature, ...orderCore } = order

    const order712 = toOrder712(orderCore)
    const tokenIdFill = order.isCollectionBid ? tokenIdCb : order.tokenId

    return [{ tokenId: tokenIdFill, actor: address }, order712, signature] as const
  }, [order, address, tokenIdCb])

  const sim = useSimulateContract({
    abi: [...orderbookAbi, ...ozErc721Errors],
    address: orderbookAddress! as Hex,
    functionName: 'settle',
    account: address,
    args,
    query: {
      enabled,
    },
  })

  return sim
}
