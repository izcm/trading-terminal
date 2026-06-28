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
  marketplace: '0xe51F2d78338487183Ce4dDB9384195B10E9c189f',
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
