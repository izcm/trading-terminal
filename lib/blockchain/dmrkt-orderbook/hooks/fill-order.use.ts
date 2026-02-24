import { useMemo } from 'react'
import { ContractFunctionExecutionError, ContractFunctionRevertedError } from 'viem'
import type { Abi, Hex } from 'viem'
import { useAccount, useSimulateContract, useWriteContract } from 'wagmi'
import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json'

import { ORDERBOOK_ERROR_MESSAGES as ERRORS } from '../error/errors'
import { toOrder712 } from '@/protocol/eip712'
import type { Order } from '@/protocol/eip712'
import { ozErc721Errors } from '../../abis/oz-erc721'

const settleAbi = [...(json.abi as Abi), ...ozErc721Errors] as Abi
const settleAddr = process.env.NEXT_PUBLIC_ORDERBOOK_CONTRACT_ADDR as Hex

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
  const { address } = useAccount()

  const enabled = !!order && !!address && (!order.isCollectionBid || tokenIdCb !== undefined)

  const args = useMemo(() => {
    if (!order || !address) return undefined

    const { signature, ...orderCore } = order

    const order712 = toOrder712(orderCore)
    const tokenIdFill = order.isCollectionBid ? tokenIdCb : order.tokenId

    return [{ tokenId: tokenIdFill, actor: address }, order712, signature] as const
  }, [order, address, tokenIdCb])

  const sim = useSimulateContract({
    abi: settleAbi,
    address: settleAddr!,
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

    const hash = await writeContractAsync(sim.data.request)

    // setTxHash(hash) // global state
    console.log('THE TX HASHHHH')
    console.log(hash)
    return hash
  }

  let errMsg

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
