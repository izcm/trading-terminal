import Link from 'next/link'

import { getSales } from '@/lib/dmrkt-indexer/actions/sales'
import { unwrap } from '@/types/core/result'

import { LineChart } from '@/components/charts/LineChart'

// https://nextjs.org/docs/app/getting-started/error-handling

// // SalesSection.tsx (Server Component)
// export async function SalesSection() {
//   const result = await getSales()

//   if (!result.ok) {
//     return <InlineError />
//   }

//   return <SalesList sales={result.data} />
// }

export default async function Home() {
  const res = await getSales()

  if (!res.ok) {
    throw new Error(res.error)
  }

  const sales = res.data as any[]
  console.log(sales)
  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto">
      <div className="flex gap-4">
        <div className="flex-1 card"></div>
        <Link href="/collections">
          <button className="btn btn-ghost">explore dmrkt</button>
        </Link>
        <Link href="/collections">
          <button className="btn btn-ghost">view more analytics</button>
        </Link>
      </div>
      <div className="flex card">
        <div className="h-80 w-1/3">
          <LineChart />
        </div>
        <div className="h-80 w-1/3">
          <LineChart />
        </div>
        <div className="h-80 w-1/3">
          <LineChart />
        </div>
      </div>
      <div className="flex gap-4 overflow-y-hidden">
        <ul className="flex-1 card">
          {sales.map(sale => (
            <li key={sale.orderHash}>
              <Link href={`./`} className="focus-visible:ring-accent rounded-lg">
                {new Date(sale.block.timestamp).toLocaleString()}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex-1 card">
          {sales.map(sale => (
            <li key={sale.orderHash}>
              <Link href={`./`} className="focus-visible:ring-accent rounded-lg">
                {sale.txHash}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
