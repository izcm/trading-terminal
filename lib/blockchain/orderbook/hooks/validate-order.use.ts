import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json'

import { useMemo } from 'react'
import { useAccount, useSimulateContract } from 'wagmi'
import { Abi, ContractFunctionExecutionError, ContractFunctionRevertedError, Hex } from 'viem'
import { Listing } from '@/domain/types/listing'
import { toOrder712 } from '@/lib/blockchain/orderbook/types/order'

const orderbookAbi = json.abi as Abi

export function useOrderValidation(listing?: Listing) {
  const { address } = useAccount()

  const enabled = !!listing && !!address

  const args = useMemo(() => {
    if (!enabled) return undefined
    const { signature, ...order } = listing!.rawOrder
    return [{ tokenId: listing.tokenId, actor: address }, toOrder712(order), signature]
  }, [listing?.id, address])

  const sim = useSimulateContract({
    abi: orderbookAbi,
    address: listing?.collection,
    functionName: 'settle',
    args,
    query: {
      enabled,
    },
  })

  return {
    isFillable: sim.isSuccess,
    checking: sim.isPending,
    error: sim.error,
  }
}
