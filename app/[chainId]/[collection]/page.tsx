import { getDmrktNFTCollection } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import { MarketplaceView } from '@/features/MarketplaceView'

const filters = {
  orders: { status: ['active'] },
  settlements: {},
  nfts: {},
}

export default async function Page({
  params,
}: {
  params: Promise<{ chainId: string; collection: string }>
}) {
  const { chainId, collection } = await params

  const collectionCall = await getDmrktNFTCollection(Number(chainId), collection)

  if (!collectionCall.ok) {
    return (
      <div className="h-screen flex items-center justify-center font-mono text-sm text-muted">
        error fetching nft collection: {collectionCall.error}
      </div>
    )
  }

  return <MarketplaceView collection={collectionCall.data} />
}
