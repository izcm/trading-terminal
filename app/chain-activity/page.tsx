import { getSales } from '@/lib/dmrkt-indexer/actions/sales.get'
import { ChainActivity } from '@/components/organisms/chain-activity/ChainActivity'

// https://nextjs.org/docs/app/getting-started/error-handling

export default async function Page() {
  const res = await getSales('limit=100&include=nftCollection&include=order')

  const initialData = res.ok
    ? { sales: res.data.items, cursor: res.data.nextCursor }
    : { sales: [], cursor: null }

  return <ChainActivity initialSales={initialData.sales} initialCursor={initialData.cursor} />
}
