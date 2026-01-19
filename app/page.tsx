import Link from 'next/link'
import { formatEther } from 'viem'

import { LayoutGrid, ChartArea, Receipt } from 'lucide-react'

import { getSales } from '@/lib/dmrkt-indexer/actions/sales'
import type { Sale } from '@/data/types/sale'

import { HomeCharts } from '@/components/organisms/HomeCharts'
import { formatTsUTC, tsMonthNameUTC } from '@/lib/utils/format/time'

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
  const res = getSales('limit=25')

  return (
    <main className="flex flex-col gap-4 max-w-7xl mx-auto">
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
        <div className="flex-1 flex justify-end gap-4">
          <Link className="btn btn-primary" href="/collections">
            <LayoutGrid /> explore dmrkt
          </Link>
          <Link className="btn btn-secondary" href="./">
            <ChartArea /> more analytics
          </Link>
        </div>
      </div>

      <HomeCharts initialData={res} />
    </main>
  )
}
