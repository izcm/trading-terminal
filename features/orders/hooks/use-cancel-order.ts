import { useChainId, useWriteContract } from 'wagmi'
import { Address } from 'viem'

import { getChainConfig } from '@/lib/blockchain/wagmi'

import { useTx } from '@/app/providers/TxProvider'
import { orderbookAbi } from '@/protocol/config'
import { WrongNetworkError } from '@/lib/blockchain/errors'

export function useCancelOrder() {
  const { addTx } = useTx()

  const chainId = useChainId()
  const chain = getChainConfig(chainId)

  const { writeContractAsync } = useWriteContract()

  async function cancelOrder(nonce: bigint, listingId?: string) {
    if (!chain) throw new WrongNetworkError('cancel order')

    const hash = await writeContractAsync({
      abi: orderbookAbi,
      address: chain.marketplace,
      functionName: 'cancelOrder',
      args: [nonce],
    })

    addTx({ hash, listingId, label: 'order cancelled' })
  }

  return {
    cancelOrder,
  }
}
