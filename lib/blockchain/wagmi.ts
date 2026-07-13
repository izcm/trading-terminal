import { createConfig, http } from 'wagmi'
import { sepolia, anvil } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const anvilChain = {
  ...anvil,
  testnet: true,
  marketplace: '0x2b0C8bcd7D285B59B2b3D8705E9595Dfcbc33B8A',
}

const sepoliaChain = {
  ...sepolia,
  marketplace: '0xB3F657a8Aa21398d9CA6a2B5386B53134E150DD0' as `0x${string}`,
  weth: '0x5f207d42F869fd1c71d7f0f81a2A67Fc20FF7323' as `0x${string}`,
}

export const wagmiConfig = createConfig({
  // chains: [anvilChain, sepoliaChain],
  chains: [sepoliaChain],

  connectors: [injected()],
  transports: {
    // [anvil.id]: http('http:/localhost/8545'),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
})

export function getChainConfig(chainId: number) {
  return wagmiConfig.chains.find(c => c.id === chainId)
}
