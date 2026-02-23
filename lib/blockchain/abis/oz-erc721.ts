export const ozErc721Errors = [
  {
    type: 'error',
    name: 'ERC721IncorrectOwner',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'owner', type: 'address' },
    ],
  },
  {
    type: 'error',
    name: 'ERC721InsufficientApproval',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'ERC721InvalidApprover',
    inputs: [{ name: 'approver', type: 'address' }],
  },
  {
    type: 'error',
    name: 'ERC721InvalidOperator',
    inputs: [{ name: 'operator', type: 'address' }],
  },
  {
    type: 'error',
    name: 'ERC721InvalidReceiver',
    inputs: [{ name: 'receiver', type: 'address' }],
  },
  {
    type: 'error',
    name: 'ERC721InvalidSender',
    inputs: [{ name: 'sender', type: 'address' }],
  },
  {
    type: 'error',
    name: 'ERC721NonexistentToken',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
  },
]
