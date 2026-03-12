import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

import { ArrowList, NFTCollectionRow } from '../molecules'
import { ArrowRow } from '../atoms'

export function NFTCollectionsList({
  collections,
  flexDir = 'col',
}: {
  collections: NFTCollection[]
  flexDir?: 'row' | 'col'
}) {
  return (
    <ArrowList
      items={collections}
      getId={(c: NFTCollection) => c.id}
      selectedId={undefined}
      onSelect={() => alert('hello')}
      className={`shrink-0 flex flex-${flexDir} border border-default rounded-lg`}
    >
      {({ item, isSelected, onSelect }) => (
        <ArrowRow
          key={item.id}
          isSelected={isSelected}
          onSelect={onSelect}
          className="base-row flex transition py-2 px-4"
        >
          <NFTCollectionRow collection={item} />
        </ArrowRow>
      )}
    </ArrowList>
  )
}
