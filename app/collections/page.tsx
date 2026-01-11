import { CollectionFilters } from '@/components/organisms/sidebar-filters/CollectionFilters'
import { CollectionList } from '@/components/organisms/CollectionList'

// import { toCollection } from '@/lib/alchemy/types/collection'

// import { getCollectionMetadata } from '@/lib/alchemy'
import { getDemoCollections } from '@/dev/collections'

const demoCollections = [ {address: "0x2E10a0A6383a084cc7449fe58D40D3702A8E57F4" as `0x${string}`}, { address: "0x8522874371974bF1dac8dF496d372319DF943A17" as `0x${string}`} ]

const mode = process.env.NEXT_PUBLIC_MODE

export default async function BrowseCollectionsPage() {
  // TODO: update this to use https://www.alchemy.com/docs/reference/nft-api-endpoints/nft-api-endpoints/nft-metadata-endpoints/get-contract-metadata-batch-v-3
  
  
  // const alchemyCollections = (
  //   await Promise.all(
  //     demoCollections.map(async c => {
  //       const res = await getCollectionMetadata(c.address)
  //       return res.ok ? res.data : null
  //     })
  //   )
  // ).filter(c => c !== null)

  // if (alchemyCollections.length == 0) {
  //   return <div>Error fetching collections...</div>
  // }

  // const collections = alchemyCollections.map(c => {
  //   return toCollection(c)
  // })

  const collections = getDemoCollections();

  return (
    <main className="flex flex-col max-w-7xl mx-auto">
      <div className="flex flex-row gap-8">
        <CollectionFilters />
        <CollectionList collections={collections} />
      </div>
    </main>
  )
}
