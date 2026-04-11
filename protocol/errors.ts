export const ORDERBOOK_ERROR_MESSAGES: Record<string, string> = {
  // orderbook
  CurrencyNotWhitelisted: 'This payment token is not supported',
  InvalidNonce: 'This order was already used or cancelled',
  InvalidOrderSide: 'This order type is invalid',
  InvalidSignature: 'The order signature is invalid',
  InvalidTimestamp: 'This order has expired or is not active yet',
  UnauthorizedFillActor: 'You are not allowed to fill this order',
  UnsupportedCollection: 'This NFT collection is not supported',
  ZeroActor: 'Order creator address is invalid',

  // signature validation
  InvalidSParameter: 'signature failed validation (s parameter)',
  InvalidYParity: 'signature failed validation (v value)',

  // safety / transfer
  ReentrancyGuardReentrantCall: 'transaction blocked for safety (reentrancy)',
  SafeERC20FailedOperation:
    'token transfer failed the payment token may not behave like a standard erc20',

  // erc721
  ERC721IncorrectOwner: 'the seller no longer owns this nft',
  ERC721InsufficientApproval: 'marketplace is not approved to transfer this nft',
  ERC721InvalidApprover: 'invalid nft approval address',
  ERC721InvalidOperator: 'invalid nft operator',
  ERC721InvalidReceiver: 'recipient cannot receive nfts',
  ERC721InvalidSender: 'sender cannot send this nft',
  ERC721NonexistentToken: 'this nft does not exist',
}
