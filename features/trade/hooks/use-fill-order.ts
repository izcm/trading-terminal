import { useWriteContract } from 'wagmi'

import { useTx } from '@/app/providers/TxProvider'

import type { Order } from '@/protocol/eip712'

import { useTradeSimulation } from './use-trade-simulation'

const safeStringify = (obj: unknown) =>
  JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)

// Short + useful 🔎
// * **react global state vs local state**
// * **nextjs app router root layout provider**
// * **react context provider persistence navigation**
// * **wagmi transaction tracking useWaitForTransactionReceipt**
// * **dapp pending transaction UX patterns**

/**
 * @param order the listing being validated
 * @param tokenIdCb tokenId to pass when listing is a collection_bid
 * @returns validation and execution state
 */

export function useFillOrder(order?: Order, listingId?: string, tokenIdCb?: bigint) {
  const { addTx } = useTx()
  const sim = useTradeSimulation(order, tokenIdCb)

  const { writeContractAsync } = useWriteContract()

  const fillOrder = async () => {
    if (!sim.isSuccess) return
    if (sim.isPending) return
    if (!sim.data?.request) return

    // setTxHash(hash) // global state / tx provider
    const hash = await writeContractAsync(sim.data.request)

    addTx(hash, listingId)
  }

  return {
    fillOrder,
    simulation: sim,
  }
}
