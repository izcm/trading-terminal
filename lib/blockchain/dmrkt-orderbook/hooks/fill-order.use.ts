import { useMemo } from 'react'
import { Abi, Hex, ContractFunctionExecutionError, ContractFunctionRevertedError } from 'viem'
import { useAccount, useSimulateContract, useWriteContract } from 'wagmi'

import { Listing } from '@/domain/types/listing'
import { orderbookContractConfig as orderbookConfig } from '../abi'
import { ORDERBOOK_ERROR_MESSAGES as ERRORS } from '../error/errors'
import { Order, toOrder712 } from '../eip712/types'
import { ozErc721Errors } from '../../abis/oz-erc721'

const settleAbi = [...(orderbookConfig.abi as Abi), ...ozErc721Errors] as Abi
const settleAddr = orderbookConfig.address as Hex

const safeStringify = (obj: unknown) =>
  JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)

// Short + useful 🔎
// * **react global state vs local state**
// * **nextjs app router root layout provider**
// * **react context provider persistence navigation**
// * **wagmi transaction tracking useWaitForTransactionReceipt**
// * **dapp pending transaction UX patterns**

/**
 *
 * @param order the listing being validated
 * @param tokenIdCb tokenId to pass when listing is a collection_bid
 * @returns validation and execution state
 */

export function useFillOrder(order?: Order, tokenIdCb?: bigint) {
  const { address } = useAccount()

  const enabled = !!order && !!address && (!order.isCollectionBid || tokenIdCb !== undefined)

  const args = useMemo(() => {
    if (!enabled || !order || !address) return undefined

    const { signature, ...orderCore } = order
    const order712 = toOrder712(orderCore)
    const tokenIdFill = order.isCollectionBid ? tokenIdCb : order.tokenId

    return [{ tokenId: tokenIdFill, actor: address }, order712, signature] as const
  }, [enabled, order, address, tokenIdCb])

  const sim = useSimulateContract({
    abi: settleAbi,
    address: settleAddr,
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

    const hash = writeContractAsync(sim.data.request)

    // setTxHash(hash) // global state
    return hash
  }

  let errMsg = `something went wrong`

  const err = sim.error

  if (
    err instanceof ContractFunctionExecutionError &&
    err.cause instanceof ContractFunctionRevertedError
  ) {
    const decoded = err.cause.data
    const name = decoded?.errorName

    if (name && name in ERRORS) {
      errMsg = ERRORS[name]
    }
  }

  return {
    // validation state
    simulation: {
      isFillable: sim.isSuccess,
      checking: sim.isPending,
      error: errMsg,
    },

    // execution state
    execution: {
      txStatus: status,
      fill,
    },
  }
}
