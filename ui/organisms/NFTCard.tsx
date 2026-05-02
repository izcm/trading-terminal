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

export function NFTCard({ nft }: { nft?: NFT }) {
  const resolved = nft ?? PLACEHOLDER_NFT

  return <GalleryItem image={resolved.image} details={details(resolved)} />
}
