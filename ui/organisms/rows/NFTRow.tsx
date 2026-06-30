import Image from 'next/image'
import type { NFT } from '@/domain/nft'
import { useCollection } from '@/features/CollectionContext'

export function NFTRow({ nft }: { nft: NFT }) {
  const { padTokenId } = useCollection()
  const rarity = nft.attributes?.find(a => a.trait_type === 'Rarity')?.value

  return (
    <div className="base-row gap-4 py-1 px-2">
      <div className="relative shrink-0">
        <Image
          src={nft.image}
          alt={nft.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded object-cover"
        />
      </div>

      <div className="flex flex-col justify-center flex-1 min-h-[56px]">
        <span className="font-semibold truncate">{nft.name}</span>
        <span className="text-xs text-muted">#{padTokenId(nft.tokenId)}</span>
        {/* {rarity && <span className="text-[11px] text-accent">{rarity}</span>} */}
      </div>
    </div>
  )
}
