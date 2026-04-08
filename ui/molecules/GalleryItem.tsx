import Image from 'next/image'
import { ReactNode } from 'react'

export function GalleryItem({
  image,
  title,
  details,
}: { image: string; title?: string } & { details?: ReactNode }) {
  return (
    <div className="card group hover:-translate-y-1 transition-transform hover:text-accent">
      <Image
        src={image}
        alt={title ?? ''}
        className="border-b border-default object-cover bg-primary"
        width={500}
        height={500}
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
