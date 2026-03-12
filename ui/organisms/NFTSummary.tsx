import { NFT } from '@/domain/nft'

import { DetailField, GalleryItem } from '../molecules'
import { Details } from './Details'

function getDetailsFields(nft: NFT): DetailField<NFT>[] {
  return nft.attributes.length > 0
    ? nft.attributes.map(a => ({
        label: a.trait_type,
        getValue: () => a.value,
      }))
    : [{ label: 'attributes', getValue: () => 'none' }]
}

const details = (nft: NFT) => <Details<NFT> item={nft} detailsFields={getDetailsFields(nft)} />

export function NFTSummary({ nft }: { nft: NFT }) {
  console.log(nft)
  return (
    <div className="pointer-events-none">
      <GalleryItem image={nft.image} title={nft.name} details={details(nft)} />
    </div>
  )
}
