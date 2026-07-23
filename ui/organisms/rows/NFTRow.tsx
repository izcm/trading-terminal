import { parseTokenURI, type NFT } from '@/domain/nft'
import { NFT_PLACEHOLDER_IMAGE } from '@/domain/constants/placeholders'
import { useCollection } from '@/features/CollectionContext'
import { ImageRow } from '@/ui/molecules/ImageRow'
import { NFTAttributes } from './NFTAttributes'

export function NFTRow({ nft }: { nft: NFT }) {
  const { padTokenId, collection } = useCollection()

  const image =
    nft.image === NFT_PLACEHOLDER_IMAGE && nft.tokenUri
      ? parseTokenURI(nft.tokenUri).image
      : nft.image

  const paddedTokenId = padTokenId(nft.tokenId)

  return (
    <div>
      <ImageRow
        image={image}
        subtitle={
          <>
            <span className="hidden md:inline-block">
              {collection?.symbol ?? 'unknown'} #{paddedTokenId}
            </span>
            <span className="md:hidden">{collection?.symbol}</span>
          </>
        }
        title={
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="truncate">
              <span className="sm:hidden">#{paddedTokenId}</span>
              <span className="hidden sm:inline">{nft.name}</span>
            </span>
          </div>
        }
        imageSize={75}
        className="md:min-h-[64px] [&_[data-slot=title]]:text-base md:[&_[data-slot=image]]:!w-[50px] md:[&_[data-slot=image]]:!h-[50px]"
      />

      <NFTAttributes attributes={nft.attributes} />
    </div>
  )
}
