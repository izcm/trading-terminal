import { NFTCollection } from '@/domain/types'

export function NFTCollectionBanner({ collection }: { collection: NFTCollection }) {
  return (
    <div className="flex items-center card px-4 py-2 relative overflow-hidden">
      <div
        className="
          absolute inset-0 
          bg-cover bg-center 
          opacity-8 brightness-100
        "
        style={{
          backgroundImage: `url(${collection.bannerImageUrl})`,
        }}
      />
      <div className="flex items-center w-full justify-between">
        <span className="font-semibold">{collection.name}</span>
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
