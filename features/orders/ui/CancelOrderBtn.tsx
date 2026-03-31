import { Ban } from '@/ui/icons'
import { useCancelOrder } from '../hooks/use-cancel-order'

export function CancelOrderBtn({ nonce, listingId }: { nonce: bigint; listingId: string }) {
  const { cancelOrder } = useCancelOrder(nonce, listingId)

  return (
    <button onClick={cancelOrder} className="btn btn-danger">
      <Ban size={16} />
      <span className="px-1">Cancel order</span>
    </button>
  )
}
