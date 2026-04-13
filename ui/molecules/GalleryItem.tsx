import Image from 'next/image'
import { ReactNode } from 'react'

type Props = {
  image: string
  imgWidth?: number
  imgHeight?: number
  title?: string
  details?: ReactNode
}

export function GalleryItem({ image, imgWidth = 250, imgHeight = 250, title, details }: Props) {
  return (
    <div className="card group hover:-translate-y-1 transition-transform hover:text-accent">
      <Image
        src={image}
        alt={title ?? ''}
        className="border-b border-default object-cover bg-primary"
        width={imgWidth}
        height={imgHeight}
      />
      <div className="flex flex-col">
        {title && (
          <span className="h-[40px] grid place-items-center border-b border-default">{title}</span>
        )}
        <div className="transition-colors">{details}</div>
      </div>
    </div>
  )
}
