export class WrongNetworkError extends Error {
  constructor(action?: string) {
    super(action ? `wrong network for action: ${action}` : 'wrong network')
  }
}
