import { RefObject, useState } from 'react'

import { TextInput } from '@/ui/atoms'
import { Popover } from '@/ui/molecules'

import { ChevronDown, Menu, Search } from '@/ui/icons'

import { tabUIConfig, type TabName } from '@/features/tab-config'
import { MobileMenu } from './Header'
import { TabBtn, Tabs } from './Tabs'

type MobileNavBarProps = {
  tab: TabName
  setTab: (tab: TabName) => void
  onOpenManual: () => void
  onOpenSettings: () => void
  searchRef: RefObject<HTMLInputElement | null>
  inputSeed: string
  resetTick: number
  handleSearch: (value: string) => void
}

export function MobileNavBar({
  tab,
  setTab,
  onOpenManual,
  onOpenSettings,
  searchRef,
  inputSeed,
  resetTick,
  handleSearch,
}: MobileNavBarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showMobileTabs, setShowMobileTabs] = useState(false)

  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch)
  const toggleMobileTabs = () => setShowMobileTabs(!showMobileTabs)

  return (
    <div className="md:hidden flex flex-col gap-2">
      <div className="flex gap-2 items-stretch">
        <div className="flex flex-col w-full border-b border-soft">
          <Popover
            align="left"
            contentClassName="w-full"
            open={showMobileTabs}
            onOpenChange={toggleMobileTabs}
            trigger={
              <TabBtn active item={tab} className="w-full">
                <>
                  <div className="flex flex-1 justify-start">
                    <div className="ml-2">
                      <ChevronDown />
                    </div>
                  </div>
                  <div>{tab}</div>
                  <div className="flex-1" />
                </>
              </TabBtn>
            }
          >
            <Tabs
              value={tab}
              onSelect={t => {
                setTab(t)
                setShowMobileTabs(false)
              }}
              items={(Object.keys(tabUIConfig) as TabName[]).filter(item => item !== tab)}
              className="justify-start ml-2"
            />
          </Popover>
        </div>

        <MobileMenu
          onOpenManual={onOpenManual}
          onOpenSettings={onOpenSettings}
          triggerBtn={
            <button className="btn btn-menu h-full">
              <Menu size={20} />
            </button>
          }
        />

        <button className="btn btn-menu h-full" onClick={toggleMobileSearch}>
          <Search size={20} />
        </button>
      </div>

      {showMobileSearch && (
        <TextInput
          key={`${tab}-${resetTick}`}
          ref={searchRef}
          value={inputSeed}
          onSubmit={value => {
            handleSearch(value)
            // toggleMobileSearch() // should this be toggled on submit? its kind of annoying
          }}
        />
      )}
    </div>
  )
}
