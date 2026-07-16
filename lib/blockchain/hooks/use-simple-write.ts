import { Abi, BaseError, ContractFunctionName, Hex } from 'viem'
import { useAccount, useChainId, useConfig, useWriteContract } from 'wagmi'
import { getPublicClient } from 'wagmi/actions'

import { WriteAction } from '../types'

type PayableStatus = 'payable' | 'nonpayable'

export function useSimpleWrite() {
  const account = useAccount()
  const chainId = useChainId()
  const config = useConfig()

  const { writeContractAsync } = useWriteContract()

  async function simpleWrite<
    const TAbi extends Abi,
    TFuncName extends ContractFunctionName<TAbi, PayableStatus>,
  >({
    abi,
    address,
    functionName,
    args,
    value,
    onSuccess,
    onError,
  }: WriteAction<TAbi, TFuncName> & {
    onSuccess?: (hash: Hex) => void
    onError?: (err: Error) => void
  }) {
    if (!account.address) return

    const publicClient = getPublicClient(config, { chainId })
    if (!publicClient) throw new Error(`no public client for chain ${chainId}`)

    try {
      const { request } = await publicClient.simulateContract({
        address,
        abi,
        functionName,
        args,
        value,
        account: account.address,
      })

      await writeContractAsync(request as Parameters<typeof writeContractAsync>[0], {
        onSuccess,
        onError,
      })
    } catch (err) {
      const message =
        err instanceof BaseError
          ? err.shortMessage
          : err instanceof Error
            ? err.message
            : String(err)
      onError?.(new Error(message))
    }
  }

  return { simpleWrite }
}
