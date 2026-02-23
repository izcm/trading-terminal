import { useMemo } from 'react'

import { orderbookContractConfig as orderbookConfig } from '../abi'
import { useAccount, useSimulateContract, useWriteContract } from 'wagmi'
import { Abi, Hex } from 'viem'
import { Listing } from '@/domain/types/listing'
import { toOrder712 } from '../eip712/types'

const orderbookAbi = orderbookConfig.abi as Abi
const orderbookAddr = orderbookConfig.address as Hex

const safeStringify = (obj: unknown) =>
  JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)

// top 5 🔎
// 1. **react context global state**
// 2. **lifting state up react**
// 3. **component state vs application state react**
// 4. **dapp pending transaction UI**
// 5. **wagmi useWaitForTransactionReceipt**

/**
 *
 * @param listing the listing being validated
 * @param tokenIdFill tokenId to pass when listing is a collection_bid
 * @returns validation and execution state
 */

export function useFillOrder(listing?: Listing, tokenIdFill?: bigint) {
  const { address } = useAccount()

  const enabled = !!listing && !!address

  const args = useMemo(() => {
    if (!enabled) return undefined

    const { signature, ...order } = listing!.rawOrder
    const order712 = toOrder712(order)

    return [{ tokenId: order712.tokenId, actor: address }, order712, signature]
  }, [listing?.id, address])

  const sim = useSimulateContract({
    abi: orderbookAbi,
    address: orderbookAddr,
    functionName: 'settle',
    account: address,
    args,
    query: {
      enabled,
    },
  })

  const { writeContractAsync, status } = useWriteContract()

  const fill = async () => {
    // data object returned by simulator refers to the last successfull simulation
    // gotta guard defend against stale data
    if (!sim.isSuccess) return
    if (sim.isPending) return
    if (!sim.data?.request) return

    return writeContractAsync(sim.data.request)
  }

  return {
    // validation state
    simulation: {
      isFillable: sim.isSuccess,
      checking: sim.isPending,
      simError: sim.error,
    },

    // execution state
    execution: {
      txStatus: status,
      fill,
    },
  }
}
