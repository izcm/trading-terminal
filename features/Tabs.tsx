import { useEffect, useState } from 'react'

import { Tab } from '@/ui/organisms/core/Tab'
import { TabCtx, tabUIConfig, type TabName, type TabResource } from './tab-config'

type Props = {
  [K in TabName]: TabResource[K][]
} & { activeTab: TabName; ctx?: TabCtx<TabName> }

export function Tabs(data: Props) {
  const tab = data.activeTab
  const ui = tabUIConfig[tab]

  const [selectedByTab, setSelectedByTab] = useState<Partial<{ [K in TabName]: TabResource[K] }>>(
    {}
  )

  return (
    <TabContainer
      ui={ui}
      items={data[tab]}
      selected={selectedByTab[tab]}
      setSelected={item => setSelectedByTab(prev => ({ ...prev, [tab]: item }))}
      ctx={data.ctx}
    />
  )
}

export function TabContainer<K extends TabName>({
  ui,
  items,
  selected,
  setSelected,
  ctx,
}: {
  ui: (typeof tabUIConfig)[K]
  items: TabResource[K][]
  selected: TabResource[K] | undefined
  setSelected: (item: TabResource[K]) => void
  ctx?: TabCtx<K>
}) {
  useEffect(() => {
    if (items.length === 0) return

    const exists = selected && items.some(i => i.id === selected.id)

    if (!exists) {
      setSelected(items[0])
    }
  }, [items, selected, setSelected])

  return (
    <Tab
      items={items}
      selected={selected}
      onSelect={setSelected}
      galleryItem={ui.galleryItem}
      mainActionBtn={item => ui.mainActionBtn(item, ctx)}
      details={ui.details}
    />
  )
}
