import { useEffect, useState } from 'react'

import { Abi, Address, ContractFunctionReturnType, Hash } from 'viem'
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi'

import { useSimpleWrite } from './use-simple-write'
import { ReadAction, ReadFunctionName, WriteAction, WriteFunctionName } from '../types'

type ActionPair<
  TReadAbi extends Abi,
  TReadFunc extends ReadFunctionName<TReadAbi>,
  TWriteAbi extends Abi,
  TWriteFunc extends WriteFunctionName<TWriteAbi>,
> = {
  readAction: Omit<ReadAction<TReadAbi, TReadFunc>, 'address'> & { address: Address | undefined }
  writeAction: Omit<WriteAction<TWriteAbi, TWriteFunc>, 'address' | 'args' | 'value'> & {
    address: Address | undefined
  }
}

export function useActionPair<
  TReadAbi extends Abi,
  TReadFunc extends ReadFunctionName<TReadAbi>,
  TWriteAbi extends Abi,
  TWriteFunc extends WriteFunctionName<TWriteAbi>,
>({ readAction, writeAction }: ActionPair<TReadAbi, TReadFunc, TWriteAbi, TWriteFunc>) {
  const { simpleWrite } = useSimpleWrite()

  // wire read
  const { data, refetch } = useReadContract({
    abi: readAction.abi,
    address: readAction.address,
    functionName: readAction.functionName,
    args: readAction.args,
    query: {
      enabled:
        (readAction.args as unknown[]).every(arg => arg !== undefined) && !!readAction.address,
    },
  } as Parameters<typeof useReadContract>[0]) as {
    data: ContractFunctionReturnType<TReadAbi, 'pure' | 'view', TReadFunc> | undefined
    refetch: () => void
  }

  const [txHash, setTxHash] = useState<Hash>()
  const [errorMessage, setErrorMessage] = useState<string>()

  function write(args: WriteAction<TWriteAbi, TWriteFunc>['args'], value?: bigint) {
    if (!writeAction.address) return

    return simpleWrite({
      abi: writeAction.abi,
      address: writeAction.address,
      functionName: writeAction.functionName,
      args,
      value,
      onSuccess: setTxHash,
      onError: err => setErrorMessage(err.message),
    })
  }

  const { data: txData, isSuccess, isError } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (!txHash) return

    if (isError) {
      setErrorMessage('Failed to confirm transaction')
    } else if (txData?.status === 'success') {
      refetch()
      setErrorMessage(undefined)
    } else if (txData?.status === 'reverted') {
      setErrorMessage('Transaction reverted')
    }
  }, [isSuccess, isError])

  useEffect(() => {
    setTxHash(undefined)
  }, [isSuccess, isError])

  return { data, refetch, write, isError: !!errorMessage, errorMessage }
}
