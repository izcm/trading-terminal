import { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

type Props = {
  image: string
  title: ReactNode
  subtitle?: ReactNode
  endContent?: ReactNode
  imageBadge?: ReactNode
  imageSize?: number
  classNames?: string
}

export function ImageRow({
  image,
  title,
  subtitle,
  endContent,
  imageBadge,
  imageSize = 50,
  classNames,
}: Props) {
  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr_auto] cursor-pointer items-center gap-4 py-1 px-2',
        classNames
      )}
    >
      <div data-slot="image-wrap" className="relative shrink-0">
        <Image
          data-slot="image"
          src={image}
          alt={image}
          width={imageSize}
          height={imageSize}
          className="rounded object-cover"
        />
        {imageBadge}
      </div>

      <div className="flex flex-col justify-center text-start min-w-0">
        <span data-slot="title" className="text-sm font-semibold truncate">
          {title}
        </span>
        <span data-slot="subtitle" className="text-xs text-muted inline-block">
          {subtitle}
        </span>
      </div>

      {endContent}
    </div>
  )
}
