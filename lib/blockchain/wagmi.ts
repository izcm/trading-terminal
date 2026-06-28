import { createConfig, http } from 'wagmi'
import { anvil, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [{ ...anvil, testnet: true }, sepolia],
  connectors: [injected()],
  transports: {
    [anvil.id]: http('http:/localhost/8545'),
    [sepolia.id]: http(process.env['SEPOLIA_RPC_URL']),
  },
})
