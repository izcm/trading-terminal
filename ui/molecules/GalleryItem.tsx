import { ReactNode } from 'react'

export function GalleryItem({
  image,
  title,
  details,
}: { image: string; title?: string } & { details?: ReactNode }) {
  return (
    <div className="card group hover:-translate-y-1 transition-transform hover:text-accent">
      <div className="border-b border-default">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="bg-secondary">
        <div className="border-b border-default p-3">
          <span>{title}</span>
        </div>
        <div className="transition-colors">{details}</div>
      </div>
    </div>
  )
}
