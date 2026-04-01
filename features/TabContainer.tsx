import { RefObject, useEffect, useRef } from 'react'

import { Tab } from '@/ui/organisms/core/Tab'
import { TabCtx, tabUIConfig, type TabName, type TabResource } from './tab-config'

export function TabContainer<K extends TabName>({
  ui,
  items,
  selectedId,
  setSelectedId,
  focusActiveTabRef,
  mainAction,
  ctx,
}: {
  ui: (typeof tabUIConfig)[K]
  items: TabResource[K][]
  selectedId: string | undefined
  setSelectedId: (id: string) => void
  focusActiveTabRef: RefObject<() => void>
  mainAction: (() => void) | undefined
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
    focusActiveTabRef.current = () => {
      galleryRef.current?.focus()
    }
  }, [focusActiveTabRef])

  return (
    <Tab
      items={items}
      selected={selected}
      onSelect={item => setSelectedId(item.id)}
      galleryItem={ui.galleryItem}
      galleryRef={galleryRef}
      mainActionBtn={item => ui.mainActionBtn?.(item, ctx)}
      action={mainAction}
      details={ui.details}
    />
  )
}
