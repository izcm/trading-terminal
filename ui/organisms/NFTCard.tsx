import type { NFT } from '@/domain/nft'

import { DetailField, GalleryItem } from '../molecules'
import { Details } from './Details'
import { NFT_LOADING_IMAGE } from '@/domain/constants/placeholders'

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
  const props = nft
    ? { image: nft.image, title: nft.name, details: details(nft) }
    : { image: NFT_LOADING_IMAGE }

  // removes rarity from title for less verbose UI
  return (
    <GalleryItem
      image={props.image}
      title={props.title}
      // title={props.title?.split(' ').slice(1).join(' ')}
      details={props.details}
    />
  )
}
