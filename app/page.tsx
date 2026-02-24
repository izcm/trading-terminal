import { DMRKT_INDEXER_BASE_URL as baseUrl } from '@/lib/dmrkt-indexer/constants'
import { Feed } from '@/components/organisms/Feed'
import { getListings } from '@/lib/dmrkt-indexer/actions/listings.get'

// https://nextjs.org/docs/app/getting-started/error-handling

export default async function Home() {
  const res = await fetch(`${baseUrl}/api/nft-collections/top?chainId=31337&limit=3`, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('failed to fetch collections')

  const collections = await res.json()

  const initial = getListings('limit=20&status=active')

  return <Feed collections={collections} initialData={initial} />
}
