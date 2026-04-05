import { RefObject, useEffect, useRef } from 'react'

import { Tab } from '@/ui/organisms/core/Tab'
import { ResolvedAction, TabCtx, tabUIConfig, type TabName, type TabResource } from './tab-config'

export function TabContainer<K extends TabName>({
  ui,
  items,
  selectedId,
  setSelectedId,
  tabAction,
  focusGalleryRef,
  onLoadMore,
  isLoading,
  hasMore,
  ctx,
}: {
  ui: (typeof tabUIConfig)[K]
  items: TabResource[K][]
  selectedId: string | undefined
  setSelectedId: (id: string) => void
  tabAction: ResolvedAction
  focusGalleryRef: RefObject<() => void>
  onLoadMore?: () => void
  isLoading?: boolean
  hasMore?: boolean
  ctx?: TabCtx<K>
}) {
  const selected = items.find(item => item.id === selectedId)

  useEffect(() => {
    if (!items.length) return

    const exists = selectedId && items.some(i => i.id === selectedId)

    if (!exists) {
      setSelectedId(items[0].id)
    }
  }, [items, selectedId, setSelectedId])

  const galleryRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    focusGalleryRef.current = () => {
      galleryRef.current?.focus()
    }
  }, [focusGalleryRef])

  const btnProps = selected
    ? ui.actionBtnProps?.(selected, tabAction.disabled, tabAction.loading, ctx)
    : undefined

  return (
    <Tab
      items={items}
      selected={selected}
      onSelect={item => setSelectedId(item.id)}
      galleryItem={ui.galleryItem}
      galleryRef={galleryRef}
      action={tabAction.run}
      actionBtnProps={btnProps}
      actionIsLoading={tabAction.loading}
      details={ui.details}
      onLoadMore={onLoadMore}
      isLoading={isLoading}
      hasMore={hasMore}
    />
  )
}
