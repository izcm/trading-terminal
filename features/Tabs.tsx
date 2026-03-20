import { useState } from 'react'

import type { Listing } from '@/domain/listing'

import { Tab } from '@/ui/organisms/core/Tab'

import { useTabData } from './hooks/tab-data.use'
import { TabName, TabResource, tabUIConfig } from './tab-config'
import { Sale } from '@/domain/sale'

type Props<T extends { id: string }> = {
  data: ReturnType<typeof useTabData<T>>
}

export function FeedTab({ data }: Props<Listing>) {
  const ui = tabUIConfig['feed']
  return <TabContainer ui={ui} data={data} />
}

export function SalesTab({ data }: Props<Sale>) {
  const ui = tabUIConfig['sales']
  return <TabContainer ui={ui} data={data} />
}

export function TabContainer<K extends TabName>({
  ui,
  data,
}: {
  ui: (typeof tabUIConfig)[K]
  data: ReturnType<typeof useTabData<TabResource[K]>>
}) {
  const { items, setFilters, loadMore } = data
  const [selected, setSelected] = useState<TabResource[K] | undefined>(items[0])

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
