import { getSales } from '@/lib/dmrkt-indexer/actions/sales'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)

  const sales = await getSales({ searchParams })
  return Response.json(sales)
}
