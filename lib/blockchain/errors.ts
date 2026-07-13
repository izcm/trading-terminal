export class WrongNetworkError extends Error {
  constructor(action?: string) {
    super(action ? `wrong network for action: ${action}` : 'wrong network')
  }
}

export class NotConnectedError extends Error {
  constructor(action?: string) {
    super(action ? `wallet not connected for action: ${action}` : 'wallet not connected')
  }
}
