const contractAddr = process.env.NEXT_PUBLIC_MARKETPLACE_ADDR

export const dmrktDomain = {
  name: 'dmrkt',
  version: '0',
  chainId: 31337,
  verifyingContract: contractAddr as `0x${string}`,
}
