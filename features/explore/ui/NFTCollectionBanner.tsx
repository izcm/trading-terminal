import type { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

export function NFTCollectionBanner({ collection }: { collection: NFTCollection }) {
  const bannerUrl =
    collection.bannerImageUrl || `/placeholders/native-collections/${collection.symbol}_BANNER.svg`

  return (
    <div className="flex flex-1 items-center card px-4 py-2 relative overflow-hidden">
      {/* <div
        className="
          absolute inset-0
          bg-cover bg-center 
          opacity-10 brightness-100 pointer-events-none
        "
        style={{
          backgroundImage: `url(${bannerUrl})`,
        }}
      /> */}
      <div className="relative z-10 flex items-center w-full justify-between">
        <div className="flex flex-col text-start">
          <span className="font-semibold">{collection.symbol}</span>
          <span className="text-muted">{collection.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm text-muted">Floor Price</span>
            <span className="text-accent">{collection.marketData?.floorPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
