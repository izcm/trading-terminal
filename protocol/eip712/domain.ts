export const dmrktDomain = (chainId: bigint, marketplaceAddr: `0x${string}`) => ({
  name: 'dmrkt',
  version: '0',
  chainId,
  verifyingContract: marketplaceAddr,
})
