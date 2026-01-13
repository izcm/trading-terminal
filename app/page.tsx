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
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      <div className="flex items-center">
        <section className="flex-2 flex justify-evenly text-accent">
          <span>
            orders <strong>12 482</strong>
          </span>

          <span>
            users <strong>1 203</strong>
          </span>

          <span>
            volume <strong>842.3</strong>
          </span>
        </section>
      <div className='flex-1 flex justify-end gap-4'>
        <Link className="btn btn-secondary" href="/collections">
          more analytics
        </Link>
         <Link className="btn btn-primary" href="/collections">
          explore dmrkt
        </Link>
      </div>
      </div>

      <div className="flex items-center card">
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
