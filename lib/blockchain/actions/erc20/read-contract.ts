import { erc20Abi } from 'viem'
import { makeContractReader } from '../contract-reader'

export const readERC20Contract = makeContractReader(erc20Abi)
