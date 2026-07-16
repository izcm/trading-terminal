import { Abi, Address, ContractFunctionArgs, ContractFunctionName, PublicClient } from 'viem'
import { ReadContractReturnType } from 'viem'

export function makeContractReader<const TAbi extends Abi>(abi: TAbi) {
  return function readContract<TFuncName extends ContractFunctionName<TAbi, 'pure' | 'view'>>(
    client: PublicClient,
    address: Address,
    functionName: TFuncName,
    args: ContractFunctionArgs<TAbi, 'pure' | 'view', TFuncName>
  ): Promise<
    ReadContractReturnType<TAbi, TFuncName, ContractFunctionArgs<TAbi, 'pure' | 'view', TFuncName>>
  > {
    return client.readContract({ address, abi, functionName, args })
  }
}
