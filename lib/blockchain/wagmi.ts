import { Address } from 'viem'
import { createConfig, http } from 'wagmi'
import { sepolia, anvil } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

type ChainExtras = { marketplace: Address; weth: Address }

const anvilChain: typeof anvil & { testnet: true } & ChainExtras = {
  ...anvil,
  testnet: true,
  marketplace: '0x2b0C8bcd7D285B59B2b3D8705E9595Dfcbc33B8A',
  weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
}

const sepoliaChain: typeof sepolia & ChainExtras = {
  ...sepolia,
  marketplace: '0xB3F657a8Aa21398d9CA6a2B5386B53134E150DD0',
  weth: '0x5f207d42F869fd1c71d7f0f81a2A67Fc20FF7323',
}

export const wagmiConfig = createConfig({
  chains: [sepoliaChain, anvilChain],

  connectors: [injected()],
  transports: {
    [anvil.id]: http('http://localhost:8545'),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
})

export function getChainConfig(chainId: number) {
  return wagmiConfig.chains.find(c => c.id === chainId)
}
