import type { NFT } from '@/domain/nft'

export function NFTRow({ nft }: { nft: NFT }) {
  const rarity = nft.attributes?.find(a => a.trait_type === 'rarity')?.value
  return (
    <div className="base-row gap-4 py-1 px-2">
      <div className="relative shrink-0">
        <img src={nft.image} alt={nft.name} className="w-12 h-12 rounded object-cover" />
      </div>

      <div className="flex flex-col justify-center flex-1 min-h-[56px]">
        <span className="font-semibold truncate">{nft.name}</span>
        <span className="text-xs text-muted">#{nft.tokenId.toString()}</span>
        {rarity && <span className="text-[11px] text-accent">{rarity}</span>}
      </div>
    </div>
  )
}
