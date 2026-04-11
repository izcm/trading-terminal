import { useWriteContract } from 'wagmi'

import { useTx } from '@/app/providers/TxProvider'
import type { Order } from '@/protocol/eip712'
import { useTradeValidation } from './use-trade-validation'
import { useTradeSimulation } from './use-trade-simulation'
import { useWallet } from '@/features/wallet/hooks/use-wallet'
import { orderbookAbi } from '@/protocol/config'
import { ORDERBOOK_ERROR_MESSAGES } from '@/protocol/errors'
import { decodeContractError } from '@/lib/blockchain/utils/error'

// const safeStringify = (obj: unknown) =>
//   JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)

/**
 * @param order the listing being validated
 * @param tokenIdCb tokenId to pass when listing is a collection_bid
 * @returns validation and execution state
 */

export function useFillOrder(order?: Order, listingId?: string, onConfirmed?: () => void) {
  const { addTx } = useTx()
  const { account } = useWallet()

  const sim = useTradeSimulation(account, order)

  const { isFillable, isChecking, error } = useTradeValidation(sim)

  const { writeContractAsync } = useWriteContract()

  async function fill() {
    if (!isFillable || isChecking || !sim.data?.request) return

    const hash = await writeContractAsync(sim.data.request)
    addTx(hash, listingId, 'order filled', onConfirmed,
      err => decodeContractError(err, orderbookAbi, ORDERBOOK_ERROR_MESSAGES)
    )
  }

  return {
    fill,
    isFillable,
    isChecking,
    error,
    hasAccount: !!account,
  }
}
