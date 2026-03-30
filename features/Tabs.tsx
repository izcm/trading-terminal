import { useEffect, useState } from 'react'

import { Tab } from '@/ui/organisms/core/Tab'
import { TabCtx, tabUIConfig, type TabName, type TabResource } from './tab-config'

type Props = {
  [K in TabName]: TabResource[K][]
} & { activeTab: TabName; ctx?: TabCtx<TabName> }

export function Tabs(data: Props) {
  const tab = data.activeTab
  const ui = tabUIConfig[tab]

  const [selectedByTab, setSelectedByTab] = useState<Partial<{ [K in TabName]: string }>>({})

  return (
    <TabContainer
      ui={ui}
      items={data[tab]}
      selectedId={selectedByTab[tab]}
      setSelectedId={id => setSelectedByTab(prev => ({ ...prev, [tab]: id }))}
      ctx={data.ctx}
    />
  )
}

export function TabContainer<K extends TabName>({
  ui,
  items,
  selectedId,
  setSelectedId,
  ctx,
}: {
  ui: (typeof tabUIConfig)[K]
  items: TabResource[K][]
  selectedId: string | undefined
  setSelectedId: (id: string) => void
  ctx?: TabCtx<K>
}) {
  const selected = items.find(item => item.id === selectedId)

  useEffect(() => {
    if (items.length === 0) return

    const exists = selectedId && items.some(i => i.id === selectedId)

    if (!exists) {
      setSelectedId(items[0].id)
    }
  }, [items, selectedId, setSelectedId])

  return (
    <Tab
      items={items}
      selected={selected}
      onSelect={item => setSelectedId(item.id)}
      galleryItem={ui.galleryItem}
      mainActionBtn={item => ui.mainActionBtn(item, ctx)}
      details={ui.details}
    />
  )
}
