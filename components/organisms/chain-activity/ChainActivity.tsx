'use client'

import { useMemo, useState } from 'react'

import 'chart.js/auto'

import type { Sale } from '@/domain/sale'
import { aggregateSales, floor } from '@/features/analytics/sales'

import { formatEth2, shortAddr, type TimeUnit } from '@/lib/utils/format'

import { ArrowList, ArrowRow, Modal } from '@/components/atoms'
import { SettlementRow, Stat } from '@/components/molecules'

import { SalesReceipt } from '../SalesReceipt'
import { Chart } from './Charts'
import { NFTSummary } from '../shared/NFTSummary'

type ShowReceiptState = { show: false } | { show: true; sale: Sale }

export type ChainActivityProps = {
  initialSales: Sale[]
  initialCursor: string | null
}

export function ChainActivity({ initialSales, initialCursor }: ChainActivityProps) {
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor)

  const [selected, setSelected] = useState<Sale | null>(
    initialSales.length ? initialSales[0] : null
  )

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

  const totalVolume = filteredSales.reduce((sum, sale) => sum + BigInt(sale.price), 0n)

  if (!selected) {
    return <div>No listing</div>
  }

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
          <div className="card h-[210px]">
            <Chart analytics={analytics} sales={filteredSales} timeUnit={timeUnit} />
          </div>

          <div className="flex gap-4 overflow-hidden">
            <ArrowList
              items={filteredSales}
              getId={sale => sale.id}
              selectedId={selected?.id}
              onSelect={setSelected}
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
        <div className="flex flex-col gap-4 basis-1/4 h-full">
          <div className="h-1/3 card">
            {selected && (
              <NFTSummary
                chainId={selected?.chainId}
                address={selected?.collection}
                tokenId={selected?.tokenId}
              />
            )}
          </div>
          <div className="h-full card">
            <SalesReceipt sale={selected} />
          </div>
        </div>
      </div>
    </div>
  )
}
