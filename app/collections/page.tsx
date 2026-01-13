import { CollectionFilters } from '@/components/organisms/sidebar-filters/CollectionFilters'
import { CollectionList } from '@/components/organisms/CollectionList'

// import { toCollection } from '@/lib/alchemy/types/collection'

// import { getCollectionMetadata } from '@/lib/alchemy'
import { getDemoCollections } from '@/dev/collections'

export default async function BrowseCollectionsPage() {
  // TODO: update this to use https://www.alchemy.com/docs/reference/nft-api-endpoints/nft-api-endpoints/nft-metadata-endpoints/get-contract-metadata-batch-v-3

  // === NON DEMO STUFF ===
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

  const collections = getDemoCollections()

  return (
    <main className="flex flex-col max-w-7xl mx-auto">
      <div className="flex flex-row gap-8">
        <CollectionFilters />
        <CollectionList collections={collections} />
      </div>
    </main>
  )
}
