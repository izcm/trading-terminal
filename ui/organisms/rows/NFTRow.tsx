import type { NFT } from '@/domain/nft'
import { useCollection } from '@/features/CollectionContext'
import { ImageRow } from '@/ui/molecules/ImageRow'

export function NFTRow({ nft }: { nft: NFT }) {
  const { padTokenId } = useCollection()

  return (
    <ImageRow
      image={nft.image}
      title={nft.name}
      subtitle={`#${padTokenId(nft.tokenId)}`}
      classNames={{ root: 'min-h-[64px] [&>*:nth-child(2)]:gap-1', title: 'text-md' }}
    />
  )
}
