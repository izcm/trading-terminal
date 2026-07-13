import { Abi, Address, ContractFunctionArgs, ContractFunctionName, Hex, PublicClient } from 'viem'
import { useAccount, useChainId, useWriteContract, UseWriteContractParameters } from 'wagmi'
import { getChainConfig } from '../wagmi'
import { WriteContractMutateAsync } from 'wagmi/query'

type PayableStatus = 'payable' | 'nonpayable'

export function useSimpleWrite() {
  const account = useAccount()

  const { writeContractAsync } = useWriteContract()

  async function simpleWrite<
    const TAbi extends Abi,
    TFuncName extends ContractFunctionName<TAbi, PayableStatus>,
  >({
    abi,
    address,
    functionName,
    args,
    onSuccess,
    onError,
  }: {
    abi: TAbi
    address: Address
    functionName: TFuncName
    args: ContractFunctionArgs<TAbi, PayableStatus, TFuncName>
    onSuccess: (hash: Hex) => void
    onError: () => void
  }) {
    if (!account.address) return

    await writeContractAsync(
      {
        abi,
        address,
        functionName,
        args,
      } as Parameters<typeof writeContractAsync>[0],
      {
        onSuccess,
        onError,
      }
    )
    // points to WriteContractAsync.variables
    // @node_modules/@wagmi/core/src/query/writeContract.ts#99-100
  }
}
