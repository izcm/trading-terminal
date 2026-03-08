'use client'

import { ImageView } from '@/ui/molecules'

type GalleryProps<T> = {
  items: T[]
  getId: (item: T) => string
  getSrc: (item: T) => string
  getTitle: (item: T) => string
  onSelect?: () => void
}

// todo: use arrow-ros (needs to cleanup the hardcoded classnames there)
export function ImageGallery<T>({ items, getId, getSrc, getTitle }: GalleryProps<T>) {
  return (
    <ul
      className="
        grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4
        card 
        "
    >
      {items.map(item => (
        <li
          key={getId(item)}
          className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg block"
        >
          <ImageView image={getSrc(item)} title={getTitle(item)} />
        </li>
      ))}
    </ul>
  )
}
