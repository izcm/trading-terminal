import Link from 'next/link'

import { getSales } from '@/lib/dmrkt-indexer/actions/sales'

import { HomeAnalytics } from '@/components/organisms'

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
      <HomeAnalytics initialData={res} />
    </main>
  )
}
