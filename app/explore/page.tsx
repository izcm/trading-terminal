import { DMRKT_INDEXER_BASE_URL as baseUrl } from '@/lib/dmrkt-indexer/constants'
import { BrowseMarket } from '@/components/organisms/ExploreMarket/ExploreMarket'
import { getListings } from '@/lib/dmrkt-indexer/actions/listings.get'

export default async function ExplorePage() {
  const res = await fetch(`${baseUrl}/api/nft-collections/top?chainId=31337&limit=3`, {
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('failed to fetch collections')

  const collections = await res.json()

  const listings = getListings()

  return <BrowseMarket collections={collections} initialListings={listings} />
}
