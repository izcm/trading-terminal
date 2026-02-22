import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json'

const contract_addr = process.env.NEXT_PUBLIC_ORDERBOOK_CONTRACT_ADDR

export const orderbookContractConfig = {
  address: contract_addr,
  abi: json.abi,
}
