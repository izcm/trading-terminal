import { useWriteContract } from 'wagmi'

import { useTx } from '@/app/providers/TxProvider'
import type { Order } from '@/protocol/eip712'
import { useTradeValidation } from './use-trade-validation'
import { useTradeSimulation } from './use-trade-simulation'

// const safeStringify = (obj: unknown) =>
//   JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)

/**
 * @param order the listing being validated
 * @param tokenIdCb tokenId to pass when listing is a collection_bid
 * @returns validation and execution state
 */

export function useFillOrder(order?: Order, listingId?: string) {
  const { addTx } = useTx()
  const sim = useTradeSimulation(order)

  const { isFillable, isChecking, error } = useTradeValidation(sim)

  const { writeContractAsync } = useWriteContract()

  async function fillOrder() {
    if (!isFillable || isChecking || !sim.data?.request) return

    const hash = await writeContractAsync(sim.data.request)
    addTx(hash, listingId)
  }

  return {
    fillOrder,
    isFillable,
    isChecking,
    error,
  }
}
