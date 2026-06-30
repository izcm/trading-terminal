import Image from 'next/image'

import { NFTCollection } from '@/domain/nft-collection'

type Props = {
  image: string
  title: string
}

export function ImageRow({ image, title }: Props) {
  return (
    <div className="base-row gap-4 py-1 px-2">
      <div className="relative shrink-0">
        <Image
          src={image}
          alt={image}
          width={48}
          height={48}
          className="w-12 h-12 rounded object-cover"
        />
      </div>

      <div className="flex flex-col justify-center flex-1 min-h-[56px]">
        <span className="font-semibold truncate">{title}</span>
      </div>
    </div>
  )
}
