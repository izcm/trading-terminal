'use client'

export function ImageView({ image, title }: { image: string; title: string }) {
  return (
    <div className="group card overflow-hidden hover:-translate-y-1 transition-transform">
      <div className="aspect-square bg-muted/10">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 border-t border-default">
        <div className="truncate group-hover:text-accent transition-colors">{title}</div>
      </div>
    </div>
  )
}
