'use client'

import { useEffect, useMemo, useState } from 'react'

import 'chart.js/auto'

import type { Sale } from '@/domain/sale'
import { aggregateSales, floor } from '@/features/analytics/sales'

import { formatEth2, shortAddr, type TimeUnit } from '@/lib/utils/format'
import { topNBy } from '@/lib/utils/analytics/topN'

import { ArrowList, ArrowRow, Modal } from '@/components/atoms'
import { SettlementRow, Stat } from '@/components/molecules'

import { SalesReceipt } from '../SalesReceipt'
import { HomeCharts } from './Charts'

type ShowReceiptState = { show: false } | { show: true; sale: Sale }

export function SalesAnalytics({
  initialSales,
  initialCursor,
}: {
  initialSales: Sale[]
  initialCursor: string | null
}) {
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor)

  const [filters, setFilters] = useState<{
    collection: string | null
    actor: string | null
    epoch: string | null
  }>({
    collection: null,
    actor: null,
    epoch: null,
  })

  // add timeUnit variable
  const timeUnit: TimeUnit = 'week'

  // tx onclick opens receipt-modal
  const [showReceipt, setShowReceipt] = useState<ShowReceiptState>({ show: false })

  const handleFilters = (filter: keyof typeof filters, value: any) => {
    if (filters[filter] === value) value = null

    setFilters(prev => ({
      ...prev,
      [filter]: value,
    }))
  }

  const applyFilters = (sales: Sale[], f: typeof filters) => {
    return sales.filter(sale => {
      if (f.collection && sale.collection !== f.collection) {
        return false
      }

      if (f.actor && sale.buyer !== f.actor && sale.seller !== f.actor) {
        return false
      }

      return true
    })
  }

  const filteredSales = useMemo(() => {
    return applyFilters(sales, filters)
  }, [filters, sales])

  const analytics = useMemo(() => {
    return aggregateSales(filteredSales, timeUnit)
  }, [filteredSales, timeUnit])

  const topCollectionsList = topNBy(analytics.byCollection, a => a.volume, 3)
  const topCollectionsByKey = useMemo(
    () => Object.fromEntries(topCollectionsList),
    [topCollectionsList]
  )

  const topActors = topNBy(analytics.byActor, a => a.buy.volume + a.sell.volume, 10)

  const totalVolume = filteredSales.reduce((sum, sale) => sum + BigInt(sale.price), 0n)

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-evenly">
        <span>
          sales <strong>{filteredSales.length}</strong>
        </span>

        <span>
          users <strong>{Array.from(analytics.byActor).length}</strong>
        </span>

        <span>
          volume <strong>{formatEth2(totalVolume)}</strong>
        </span>
      </div>

      <div className="h-full flex gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-4 h-[200px]">
            <HomeCharts analytics={analytics} sales={filteredSales} timeUnit={timeUnit} />
          </div>

          <div className="flex gap-4 overflow-hidden">
            <ArrowList
              items={filteredSales}
              getId={sale => sale.id}
              selectedId={undefined}
              onSelect={sale => {
                setShowReceipt({ show: true, sale })
              }}
              className="flex-1"
            >
              {({ item, isSelected, onSelect }) => (
                <ArrowRow
                  key={item.id}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  className="flex justify-between px-4 min-h-14"
                >
                  <SettlementRow sale={item} />
                </ArrowRow>
              )}
            </ArrowList>
          </div>
        </div>
        <div className="basis-1/4 h-full card">
          <div>Right Panel Content</div>
        </div>
      </div>

      {showReceipt.show && (
        <Modal isOpen={showReceipt.show} onClose={() => setShowReceipt({ show: false })}>
          <div className="p-2 flex flex-col gap-4">
            <SalesReceipt sale={showReceipt.sale} />
            <div className="border-t border-default mt-4" />
            <button className="btn btn-secondary" onClick={() => setShowReceipt({ show: false })}>
              close
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
