import { createConfig, http } from 'wagmi'
import { anvil, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// const anvilChain = {
//   ...anvil,
//   testnet: true,
//   marketplace: '0x2b0C8bcd7D285B59B2b3D8705E9595Dfcbc33B8A',
// }

const sepoliaChain = {
  ...sepolia,
  marketplace: '0xF0d371989151dd235e5178F5f664a363D7a3A1f3' as `0x${string}`,
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
