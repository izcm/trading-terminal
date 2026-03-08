import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json'

export const orderbookAbi = json.abi
export const orderbookAddress = process.env.NEXT_PUBLIC_ORDERBOOK_CONTRACT_ADDR
