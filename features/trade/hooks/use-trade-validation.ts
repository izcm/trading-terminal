import { ContractFunctionExecutionError, ContractFunctionRevertedError } from 'viem'

import { ORDERBOOK_ERROR_MESSAGES as ERRORS } from '@/protocol/errors'
import { Order } from '@/protocol/eip712'

import { useTradeSimulation } from './use-trade-simulation'

export function useTradeValidation(order?: Order, tokenIdCb?: bigint) {
  const sim = useTradeSimulation(order, tokenIdCb)

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
    isFillable: sim.isSuccess,
    checking: sim.isPending,
    error: errMsg,
  }
}
