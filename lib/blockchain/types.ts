import { Abi, AbiStateMutability, Address, ContractFunctionArgs, ContractFunctionName } from 'viem'

export type ReadFunctionName<TAbi extends Abi> = ContractFunctionName<TAbi, 'pure' | 'view'>
export type WriteFunctionName<TAbi extends Abi> = ContractFunctionName<
  TAbi,
  'nonpayable' | 'payable'
>

type ContractAction<
  TStatus extends AbiStateMutability,
  TAbi extends Abi = Abi,
  TFuncName extends ContractFunctionName<TAbi, TStatus> = ContractFunctionName<TAbi, TStatus>,
> = {
  abi: TAbi
  address: Address
  functionName: TFuncName
  args: ContractFunctionArgs<TAbi, TStatus, TFuncName>
}

export type ReadAction<
  TAbi extends Abi = Abi,
  TFuncName extends ReadFunctionName<TAbi> = ReadFunctionName<TAbi>,
> = ContractAction<'pure' | 'view', TAbi, TFuncName>

export type WriteAction<
  TAbi extends Abi = Abi,
  TFuncName extends WriteFunctionName<TAbi> = WriteFunctionName<TAbi>,
> = ContractAction<'payable' | 'nonpayable', TAbi, TFuncName> & { value?: bigint }
