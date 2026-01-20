import { abi } from '@a2zb/packages/abis/dmrkt/OrderEngine.json'

const contract_addr = process.env.ORDERBOOK_CONTRACT_ADDR

export const orderbookContractConfig = {
  address: contract_addr,
  abi: abi,
}
