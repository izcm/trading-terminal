import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json'

const entrypoint = process.env.NEXT_PUBLIC_ORDERBOOK_CONTRACT_ADDR

import { useMemo } from 'react'
import { useAccount, useSimulateContract } from 'wagmi'
import { Abi, Hex } from 'viem'
import { Listing } from '@/domain/types/listing'
import { toOrder712 } from '../eip712/types'

const orderbookAbi = json.abi as Abi

const safeStringify = (obj: unknown) =>
  JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value), 2)

export function useOrderValidation(listing?: Listing) {
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
    address: entrypoint as Hex,
    functionName: 'settle',
    account: address,
    args,
    query: {
      enabled,
    },
  })

  console.log(safeStringify(sim.error))

  return {
    isFillable: sim.isSuccess,
    checking: sim.isPending,
    error: sim.error,
  }
}
