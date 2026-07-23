import { parseTokenURI, type NFT } from '@/domain/nft'
import { NFT_PLACEHOLDER_IMAGE } from '@/domain/constants/placeholders'
import { useCollection } from '@/features/CollectionContext'
import { ImageRow } from '@/ui/molecules/ImageRow'

export function NFTRow({ nft }: { nft: NFT }) {
  const { padTokenId } = useCollection()

  const image =
    nft.image === NFT_PLACEHOLDER_IMAGE && nft.tokenUri
      ? parseTokenURI(nft.tokenUri).image
      : nft.image

  return (
    <ImageRow
      image={image}
      title={nft.name}
      subtitle={`#${padTokenId(nft.tokenId)}`}
      className="min-h-[64px] [&>*:nth-child(2)]:gap-1 [&_[data-slot=title]]:text-base"
    />
  )
}
