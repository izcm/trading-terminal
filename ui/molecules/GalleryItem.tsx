export function GalleryItem({ image, title }: { image: string; title: string }) {
  return (
    <div className="card group hover:-translate-y-1 transition-transform">
      <div className="bg-muted/10 border-b border-default">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-2 rounded-xl bg-secondary">
        <div className="group-hover:text-accent transition-colors">{title}</div>
      </div>
    </div>
  )
}
