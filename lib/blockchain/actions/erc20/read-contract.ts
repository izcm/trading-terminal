import { erc20Abi } from 'viem'
import { makeContractReader } from '../contract-reader'

export const readContract = makeContractReader(erc20Abi)
