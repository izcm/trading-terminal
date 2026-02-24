const contractAddr = process.env.NEXT_PUBLIC_ORDERBOOK_CONTRACT_ADDR

export const domain = {
  name: 'dmrkt',
  version: '0',
  chainId: 31337,
  verifyingContract: contractAddr as `0x${string}`,
}
