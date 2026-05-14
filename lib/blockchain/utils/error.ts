import {
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  decodeErrorResult,
  type Abi,
} from 'viem'

/**
 * Attempts to decode a contract error into a human-readable message.
 *
 * - If the error is a ContractFunctionExecutionError with a revert, decodes via err.cause.data
 * - Otherwise, falls back to extracting a 4-byte selector from the raw message and decoding it against the abi
 *
 * Returns the decoded error name (or decoded result) if successful, undefined otherwise.
 */
export function decodeContractError(
  error: unknown,
  abi: Abi,
  errorMessages?: Record<string, string>
): string | undefined {
  if (
    error instanceof ContractFunctionExecutionError &&
    error.cause instanceof ContractFunctionRevertedError
  ) {
    const decoded = error.cause.data
    const name = decoded?.errorName

    if (name) {
      return errorMessages && name in errorMessages ? errorMessages[name] : name
    }
  }

  if (error instanceof Error) {
    const selector = error.message.match(/0x[a-fA-F0-9]{8}/)?.[0]
    if (selector) {
      try {
        const decoded = decodeErrorResult({ abi, data: selector as `0x${string}` })
        const name = decoded.errorName
        return errorMessages && name in errorMessages ? errorMessages[name] : name
      } catch {
        // selector didn't match anything in the abi
      }
    }
  }

  return undefined
}
