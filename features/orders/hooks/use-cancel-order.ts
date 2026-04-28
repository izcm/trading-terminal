import { useWriteContract } from 'wagmi'
import { Address } from 'viem'

import { useTx } from '@/app/providers/TxProvider'
import { orderbookAbi, orderbookAddress } from '@/protocol/config'

export function useCancelOrder() {
  const { addTx } = useTx()

  const { writeContractAsync } = useWriteContract()

  async function cancelOrder(nonce: bigint, listingId?: string) {
    const hash = await writeContractAsync({
      abi: orderbookAbi,
      address: orderbookAddress! as Address,
      functionName: 'cancelOrder',
      args: [nonce],
    })

    addTx({ hash, listingId, label: 'order cancelled' })
  }

  return {
    cancelOrder,
  }
}
