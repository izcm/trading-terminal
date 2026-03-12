import { ReactNode } from 'react'

export function GalleryItem({
  image,
  title,
  details,
}: { image: string; title: string } & { details?: ReactNode }) {
  return (
    <div className="card bg-primary group hover:-translate-y-1 transition-transform">
      <div className="border-b border-default">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="bg-secondary">
        <div className="border-b border-default bg-primary/50 p-3">
          <span>{title}</span>
        </div>
        <div className="group-hover:text-accent transition-colors">{details}</div>
      </div>
    </div>
  )
}
