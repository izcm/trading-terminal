'use client'

import { Search } from 'lucide-react'
import { TextInput } from '@/components/atoms/TextInput'
import { Checkbox } from '@/components/atoms/Checkbox'
import { FormSelect } from '@/components/atoms/FormSelect'
import { SidebarContainer } from '../../atoms/SidebarContainer'

export function CollectionFilters() {
  return (
    <SidebarContainer>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <TextInput />
      </div>
      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4">
        {/* Collection Type */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted">Type</label>
          <div className="flex flex-col gap-1">
            {['All', 'ERC721', 'ERC1155'].map(type => (
              <Checkbox key={type} label={type} />
            ))}
          </div>
        </div>

        {/* Volume */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted">Volume</label>
          <FormSelect
            options={[
              { label: 'High to Low', value: 'high' },
              { label: 'Low to High', value: 'low' },
            ]}
            onChange={value => console.log('Volume:', value)}
            defaultValue="high"
          />
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted">Sort</label>
          <FormSelect
            options={[
              { label: 'Trending', value: 'trending' },
              { label: 'Newest', value: 'newest' },
              { label: 'Most Active', value: 'active' },
            ]}
            onChange={value => console.log('Sort:', value)}
            defaultValue="trending"
          />
        </div>
      </div>
    </SidebarContainer>
  )
}
