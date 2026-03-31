import { createConfig, http } from 'wagmi'
import { anvil, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [{ ...anvil, testnet: true }, sepolia],
  connectors: [injected()],
  transports: {
    [anvil.id]: http(),
    [sepolia.id]: http(),
  },
})
