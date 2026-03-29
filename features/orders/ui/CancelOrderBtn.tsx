import { Ban } from 'lucide-react'
import { useCancelOrder } from '../hooks/use-cancel-order'

export function CancelOrderBtn({ nonce, listingId }: { nonce: bigint; listingId: string }) {
  const { cancelOrder } = useCancelOrder(nonce, listingId)

  return (
    <button className={'btn btn-danger'} onClick={cancelOrder}>
      <Ban size={16} />
      <span className="px-1">Cancel order</span>
    </button>
  )
}
