
import { getSales } from '@/lib/dmrkt-indexer/actions/sales.get'

import { SalesAnalytics } from '@/components/organisms'

// https://nextjs.org/docs/app/getting-started/error-handling

export default async function Analytics() {
  const res = getSales('limit=25')

  return <SalesAnalytics initialData={res} />
}
