import { useEffect, useState } from 'react'

import { Tab } from '@/ui/organisms/core/Tab'

import { useTabData } from './hooks/tab-data.use'
import { TabName, TabResource, tabUIConfig } from './tab-config'

type Props = {
  [K in TabName]: ReturnType<typeof useTabData<TabResource[K]>>
} & { activeTab: TabName }

export function Tabs(data: Props) {
  const ui = tabUIConfig[data.activeTab]
  return <TabContainer ui={ui} data={data[data.activeTab]} />
}

export function TabContainer<K extends TabName>({
  ui,
  data,
}: {
  ui: (typeof tabUIConfig)[K]
  data: ReturnType<typeof useTabData<TabResource[K]>>
}) {
  const { items, setFilters, loadMore } = data
  const [selected, setSelected] = useState<TabResource[K] | undefined>()

  useEffect(() => {
    setSelected(items[0])
  }, [items])

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
