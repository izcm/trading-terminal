import { getSales } from '@/lib/dmrkt-indexer/actions/sales.get'

import { SalesAnalytics } from '@/components/organisms'

// https://nextjs.org/docs/app/getting-started/error-handling

export default async function Analytics() {
  const res = await getSales('limit=100')

  const initialData = res.ok
    ? { sales: res.data.items, cursor: res.data.nextCursor }
    : { sales: [], cursor: null }

  return <SalesAnalytics initialSales={initialData.sales} initialCursor={initialData.cursor} />
}
