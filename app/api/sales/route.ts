import { getSales } from '@/lib/dmrkt-indexer/actions/sales.get'

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url)
  const sales = await getSales(searchParams.toString())
  return Response.json(sales)
}
