import { useMemo } from 'react'

import { Address } from 'viem'
import { useSimulateContract } from 'wagmi'

import { Order, toOrder712 } from '@/protocol/eip712'
import { orderbookAbi } from '@/protocol/config'

import { ozErc721Errors } from '@/lib/blockchain'
import { safeSerialize } from '@/lib/utils/json'
import { getChainConfig } from '@/lib/blockchain/wagmi'
import { useWallet } from '@/features/wallet/hooks/use-wallet'

export function useTradeSimulation(order?: Order, tokenIdCb?: bigint) {
  const { account: user, chainId } = useWallet()
  const chain = chainId ? getChainConfig(chainId) : undefined

  const enabled =
    !!chain && !!order && !!user && (!order.isCollectionBid || tokenIdCb !== undefined)

  const args = useMemo(() => {
    if (!order || !user) return undefined

    const { signature, ...orderCore } = order

    const order712 = toOrder712(orderCore)
    const tokenIdFill = order.isCollectionBid ? tokenIdCb : order.tokenId

    return [{ tokenId: tokenIdFill, actor: user }, order712, signature] as const
  }, [order, user, tokenIdCb])

  const sim = useSimulateContract({
    abi: [...orderbookAbi, ...ozErc721Errors],
    address: chain?.marketplace,
    functionName: 'settle',
    account: user,
    args,
    query: {
      enabled,
    },
  })

  console.log(safeSerialize(sim))

  return sim
}
