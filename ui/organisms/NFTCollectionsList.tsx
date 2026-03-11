import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'

import { ArrowList, NFTCollectionRow } from '../molecules'
import { ArrowRow } from '../atoms'

export function NFTCollectionsList({ collections }: { collections: NFTCollection[] }) {
  return (
    <ArrowList
      items={collections}
      getId={(c: NFTCollection) => c.id}
      selectedId={undefined}
      onSelect={() => alert('hello')}
      className="shrink-0 card"
    >
      {({ item, isSelected, onSelect }) => (
        <ArrowRow
          key={item.id}
          isSelected={isSelected}
          onSelect={onSelect}
          className="base-row rounded-md transition gap-4 p-1 flex justify-between w-full"
        >
          <NFTCollectionRow collection={item} />
        </ArrowRow>
      )}
    </ArrowList>
  )
}
