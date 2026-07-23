import type { NFTAttribute } from '@/domain/nft'
import { DotList } from '@/ui/atoms'

type Props = {
  attributes: NFTAttribute[]
}

export function NFTAttributes({ attributes }: Props) {
  if (attributes.length === 0) return null

  return (
    <div className="md:hidden px-2">
      <DotList
        items={attributes}
        getValue={a => `${a.trait_type}: ${a.value}`}
        className="text-xs font-medium text-subtle"
      />
    </div>
  )
}
