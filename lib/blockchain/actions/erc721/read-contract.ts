import { erc721Abi } from 'viem'
import { makeContractReader } from '../contract-reader'

export const readContract = makeContractReader(erc721Abi)
