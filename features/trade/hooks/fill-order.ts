import { useWriteContract } from 'wagmi'

import type { Order } from '@/protocol/eip712'

import { useTradeSimulation } from './trade-simulation.use'

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

export function useFillOrder(order?: Order, tokenIdCb?: bigint) {
  const sim = useTradeSimulation(order, tokenIdCb)
  const { writeContractAsync, status } = useWriteContract()

  const fillOrder = async () => {
    if (!sim.isSuccess) return
    if (sim.isPending) return
    if (!sim.data?.request) return

    // setTxHash(hash) // global state / tx provider
    return writeContractAsync(sim.data.request)
  }

  return {
    txStatus: status,
    fillOrder,
    simulation: sim,
  }
}
