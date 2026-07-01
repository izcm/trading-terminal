import { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

type Props = {
  image: string
  title: string
  subtitle?: string
  endContent?: ReactNode
  imageSize?: number
  classNames?: {
    title?: string
    subtitle?: string
    image?: string
    root?: string
  }
}

export function ImageRow({
  image,
  title,
  subtitle,
  endContent,
  imageSize = 48,
  classNames,
}: Props) {
  return (
    <div className={cn('base-row gap-4 py-1 px-2', classNames?.root)}>
      <div className="relative shrink-0">
        <Image
          src={image}
          alt={image}
          width={imageSize}
          height={imageSize}
          className={cn('w-12 h-12 rounded object-cover', classNames?.image)}
        />
      </div>

      <div className="flex flex-col justify-center">
        <span className={cn('text-sm font-semibold truncate', classNames?.title)}>{title}</span>
        <span className={cn('text-xs text-muted font-muted truncate', classNames?.subtitle)}>
          {subtitle}
        </span>
      </div>

      {endContent}
    </div>
  )
}
