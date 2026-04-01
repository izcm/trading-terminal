import { RefObject, useEffect, useRef } from 'react'

import { Tab } from '@/ui/organisms/core/Tab'
import { ResolvedAction, TabCtx, tabUIConfig, type TabName, type TabResource } from './tab-config'

export function TabContainer<K extends TabName>({
  ui,
  items,
  selectedId,
  setSelectedId,
  tabAction,
  focusActiveTabRef,
  ctx,
}: {
  ui: (typeof tabUIConfig)[K]
  items: TabResource[K][]
  selectedId: string | undefined
  setSelectedId: (id: string) => void
  tabAction: ResolvedAction
  focusActiveTabRef: RefObject<() => void>
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
      details={ui.details}
    />
  )
}
