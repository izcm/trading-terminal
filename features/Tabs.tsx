import { useEffect, useState } from 'react'

import { Tab } from '@/ui/organisms/core/Tab'
import { tabUIConfig, type TabName, type TabResource } from './tab-config'

type Props = {
  [K in TabName]: TabResource[K][]
} & { activeTab: TabName }

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
    />
  )
}
export function TabContainer<K extends TabName>({
  ui,
  items,
  selected,
  setSelected,
}: {
  ui: (typeof tabUIConfig)[K]
  items: TabResource[K][]
  selected: TabResource[K] | undefined
  setSelected: (item: TabResource[K]) => void
}) {
  // set default ONLY if none selected yet
  useEffect(() => {
    if (!selected && items.length > 0) {
      setSelected(items[0])
    }
  }, [items, selected, setSelected])

  return (
    <Tab
      items={items}
      selected={selected}
      onSelect={setSelected}
      galleryItem={ui.galleryItem}
      mainActionBtn={ui.mainActionBtn}
      details={ui.details}
    />
  )
}
