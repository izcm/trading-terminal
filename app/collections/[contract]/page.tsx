import { CollectionView } from '@/features/orderbook/ui/CollectionView'

import { getCollectionMetadata, getNFTByContract, getCollectionAttributes } from '@/lib/alchemy'
import { toCollection, toNFT } from '@/lib/alchemy'
import { NFT } from '@/data/types'

export default async function CollectionPage(props: { params: Promise<{ contract: string }> }) {
  const contractRaw = (await props.params).contract
  const contract = contractRaw as `0x${string}`

  const attributesRes = await getCollectionAttributes(contract)
  const collectionRes = await getCollectionMetadata(contract)
  // TODO: update to use https://www.alchemy.com/docs/reference/nft-api-endpoints/nft-api-endpoints/nft-metadata-endpoints/get-nft-metadata-batch-v-3
  // + use totalsupply to get number of NFTs and [Batch] for pagination
  // const nftsRes = await getNFTByContract(contract)

  if (!collectionRes.ok) {
    return (
      <main>
        <div>Failed to load collection</div>
      </main>
    )
  }

  const collection = toCollection(collectionRes.data)
  // const nfts = nftsRes.metas.map(raw => {
  //   return toNFT(raw)
  // })

  const nfts: NFT[] = []

  return (
    <main className="flex flex-col gap-4 max-w-7xl mx-auto">
      <CollectionView collection={collection} attributes={attributesRes} nfts={nfts} />
    </main>
  )
}
