import { useMemo } from 'react'
import { useSimulateContract } from 'wagmi' // todo: decouple
import { Address } from 'viem'

import { Order, toOrder712 } from '@/protocol/eip712'
import { orderbookAbi, orderbookAddress } from '@/protocol/config'
import { ozErc721Errors } from '@/lib/blockchain'
import { useWallet } from '@/features/wallet/hooks/use-wallet'

export function useTradeSimulation(order?: Order, tokenIdCb?: bigint) {
  const { account } = useWallet()

  const enabled = !!order && !!account && (!order.isCollectionBid || tokenIdCb !== undefined)

  const args = useMemo(() => {
    if (!order || !account) return undefined

    const { signature, ...orderCore } = order

    const order712 = toOrder712(orderCore)
    const tokenIdFill = order.isCollectionBid ? tokenIdCb : order.tokenId

    return [{ tokenId: tokenIdFill, actor: account }, order712, signature] as const
  }, [order, account, tokenIdCb])

  const sim = useSimulateContract({
    abi: [...orderbookAbi, ...ozErc721Errors],
    address: orderbookAddress! as Address,
    functionName: 'settle',
    account: account,
    args,
    query: {
      enabled,
    },
  })

  return sim
}
