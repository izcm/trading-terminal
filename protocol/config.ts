import json from '@a2zb/packages/abis/dmrkt/OrderEngine.json'
import { Abi } from 'viem'

export const orderbookAbi = json.abi as Abi
const addr = process.env.NEXT_PUBLIC_MARKETPLACE_ADDR

if (!orderbookAbi) throw new Error('Missing NEXT_PUBLIC_MARKETPLACE_ADDR')

export const orderbookAddress = addr as `0x${string}`
