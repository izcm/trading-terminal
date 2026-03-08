import { Feed } from '@/components/organisms/Feed'
import { getListings } from '@/lib/dmrkt-indexer/actions/listings.get'
import { DMRKT_INDEXER_BASE_URL as baseUrl } from '@/lib/dmrkt-indexer/constants'

export default async function Page() {
  const res = await fetch(`${baseUrl}/api/nft-collections/top?chainId=31337&limit=3`, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('failed to fetch collections')

  const collections = await res.json()

  const listingRes = await getListings()

  const initialData = listingRes.ok
    ? { items: listingRes.data.items, cursor: listingRes.data.nextCursor }
    : { items: [], cursor: null }

  return (
    <Feed
      collections={collections}
      initialListings={initialData.items}
      initialCursor={initialData.cursor}
    />
  )
}
