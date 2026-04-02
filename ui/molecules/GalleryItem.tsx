import { ReactNode } from 'react'

export function GalleryItem({
  image,
  title,
  details,
}: { image: string; title?: string } & { details?: ReactNode }) {
  return (
    <div className="card group hover:-translate-y-1 transition-transform hover:text-accent">
      <img src={image} alt={title} className="border-b border-default object-cover" />
      <div className="bg-secondary flex flex-col">
        {title && (
          <span className="h-[40px] grid place-items-center border-b border-default">{title}</span>
        )}
        <div className="transition-colors">{details}</div>
      </div>
    </div>
  )
}
