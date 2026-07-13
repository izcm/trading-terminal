import { erc721Abi } from 'viem'
import { makeContractReader } from '../contract-reader'

export const readERC721Contract = makeContractReader(erc721Abi)
