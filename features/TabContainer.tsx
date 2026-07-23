import { RefObject, useEffect, useRef } from 'react'

import { Tab } from '@/ui/molecules'
import { ResolvedAction, TabCtx, tabUIConfig, type TabName, type TabResource } from './tab-config'

type Props<K extends TabName> = {
  // ui
  ui: (typeof tabUIConfig)[K]
  focusGalleryRef: RefObject<() => void>

  // items and selection
  items: TabResource[K][]
  selectedId: string | undefined
  setSelectedId: (id: string) => void

  // action + pagination
  tabAction: ResolvedAction
  onLoadMore?: () => void
  isLoading?: boolean
  hasMore?: boolean

  // ctx
  ctx?: TabCtx
  isFresh?: (item: TabResource[K]) => boolean
}

export function TabContainer<K extends TabName>({
  ui,
  focusGalleryRef,
  items,
  selectedId,
  setSelectedId,
  tabAction,
  onLoadMore,
  isLoading,
  hasMore,
  ctx,
  isFresh,
}: Props<K>) {
  const selected = items.find(item => item.id === selectedId)

  useEffect(() => {
    if (!items.length) return

    const exists = selectedId !== undefined && items.some(i => i.id === selectedId)

    if (!exists) {
      setSelectedId(items[0].id)
    }
  }, [items, selectedId, setSelectedId])

  const galleryRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    focusGalleryRef.current = () => galleryRef.current?.focus()
  }, [focusGalleryRef])

  const btnProps = selected ? ui.actionBtnProps?.(selected, tabAction.disabled, ctx) : undefined

  return (
    <div className="flex-1 flex min-h-0 fade-in">
      <Tab
        gallery={{
          items,
          selected,
          onSelect: item => setSelectedId(item.id),
          galleryItem: item => {
            if (ui.galleryItems !== undefined) {
              return (
                <div>
                  <div className="hidden md:block">{ui.galleryItems.row(item)}</div>
                  <div className="md:hidden">{ui.galleryItems.card(item)}</div>
                </div>
              )
            }
            return ui.galleryItem(item)
          },
          isFresh,
          ref: galleryRef,
          onLoadMore,
          isLoading,
          hasMore,
        }}
        actionBtn={{
          action: tabAction.run,
          props: btnProps,
          isLoading: tabAction.loading,
        }}
        details={ui.details}
      />
    </div>
  )
}
