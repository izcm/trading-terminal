import Image from 'next/image'

import { PLACEHOLDER_NFT, type NFT } from '@/domain/nft'

import { DetailField, Details, GalleryItem } from '@/ui/molecules'

function getDetailsFields(nft: NFT): DetailField<NFT>[] {
  return nft.attributes.length > 0
    ? nft.attributes.map(a => ({
        label: a.trait_type,
        getValue: () => a.value,
      }))
    : [{ label: 'attributes', getValue: () => 'none' }]
}

const details = (nft: NFT) => <Details<NFT> item={nft} detailsFields={getDetailsFields(nft)} />

type Props = {
  nft?: NFT
  layout?: 'row' | 'column'
}

export function NFTCard({ nft, layout = 'column' }: Props) {
  const resolved = nft ?? PLACEHOLDER_NFT

  if (layout === 'row') {
    return (
      <div className="card flex gap-3 p-2">
        <Image
          src={resolved.image}
          alt={resolved.name}
          width={80}
          height={80}
          className="rounded object-cover shrink-0 bg-primary"
          loading="eager"
        />
        <div className="flex-1 min-w-0">{details(resolved)}</div>
      </div>
    )
  }

  return <GalleryItem image={resolved.image} details={details(resolved)} />
}
