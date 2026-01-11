'use client'

import { Checkbox, Select } from '@/components/atoms'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { SidebarContainer } from '@/components/atoms'

interface NFTFiltersProps {
  traits: [string, Record<string, number>][]
  filters: any
  setFilters: any
}

export const CollectionItemFilters = ({ traits, filters, setFilters }: NFTFiltersProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (type: string) => {
    setOpenSections(prev => ({
      ...prev,
      [type]: !prev[type],
    }))
  }
  return (
    <SidebarContainer>
      {/* TRAITS */}
      <div>
        <h3 className="text-sm font-bold mb-2">Status</h3>
        <div className="flex flex-col gap-2">
          <Checkbox label="Buy Now" />
          <Checkbox label="Has Offers" />
        </div>
      </div>
      <ul>
        {traits.map(([type, values]) => (
          <li key={type} className="text-start">
            <button
              onClick={() => toggleSection(type)}
              className="btn flex w-full justify-between items-center py-1"
            >
              <span>{type}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${openSections[type] ? 'rotate-180' : ''}`}
              />
            </button>
            {openSections[type] && (
              <ul className="ml-2">
                {Object.keys(values).map((value, i) => (
                  <li key={`${value}-${i}`} className="mb-2">
                    <Checkbox label={value} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </SidebarContainer>
  )
}
