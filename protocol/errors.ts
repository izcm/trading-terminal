export const ORDERBOOK_ERROR_MESSAGES: Record<string, string> = {
  // orderbook
  CurrencyNotWhitelisted: 'Payment token not supported',
  InvalidNonce: 'Order already filled or cancelled',
  InvalidOrderSide: 'Invalid order type',
  InvalidSignature: 'Invalid order signature',
  InvalidTimestamp: 'Order expired or not active',
  UnauthorizedFillActor: 'Not allowed to fill this order',
  UnsupportedCollection: 'NFT collection not supported',
  ZeroActor: 'Invalid order creator address',

  // signature validation
  InvalidSParameter: 'Signature validation failed (s parameter)',
  InvalidYParity: 'Signature validation failed (v value)',

  // safety / transfer
  ReentrancyGuardReentrantCall: 'Transaction blocked (reentrancy)',
  SafeERC20FailedOperation: 'Token transfer failed (non-standard ERC20 behavior)',

  // erc721
  ERC721IncorrectOwner: 'Seller no longer owns this NFT',
  ERC721InsufficientApproval: 'Marketplace not approved to transfer NFT',
  ERC721InvalidApprover: 'Invalid NFT approval address',
  ERC721InvalidOperator: 'Invalid NFT operator',
  ERC721InvalidReceiver: 'Recipient cannot receive NFTs',
  ERC721InvalidSender: 'Sender cannot send this NFT',
  ERC721NonexistentToken: 'NFT does not exist',
}
