'use client'

import { useEffect, useState } from 'react'

function Row({ label, value, copy }: { label: string; value: React.ReactNode; copy?: string }) {
  return (
    <div
      className={`
        flex flex-col md:flex-row md:justify-between md:items-center py-1.5 md:py-1 gap-0.5 md:gap-4
        ${copy ? ' hover:text-accent-string transition' : ''}
      `}
      onClick={() => copy && navigator.clipboard.writeText(copy)}
    >
      <span className="text-sm font-mono text-accent">{label}</span>
      <span className="text-sm text-subtle md:text-right">{value}</span>
    </div>
  )
}

function ExRow({ query, desc }: { query: string; desc: string }) {
  return (
    <div
      className="flex flex-col py-2 md:py-1 gap-0.5 hover:text-accent-string transition cursor-pointer"
      onClick={() => navigator.clipboard.writeText(query)}
    >
      <span className="text-sm font-mono text-accent/80">{query}</span>
      <span className="text-sm text-muted">{desc}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-soft pt-4 space-y-2">
      <h3 className="text-[11px] text-subtle uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  )
}

type Tab = 'shortcuts' | 'filters' | 'examples'

const TABS: { key: Tab; label: string; shortcut: string }[] = [
  { key: 'shortcuts', label: 'shortcuts', shortcut: '1' },
  { key: 'filters', label: 'filters', shortcut: '2' },
  { key: 'examples', label: 'examples', shortcut: '3' },
]

export function Manual({ initialTab = 'shortcuts' }: { initialTab?: Tab } = {}) {
  const [tab, setTab] = useState<Tab>(initialTab)

  // shortcuts are keyboard-only and don't apply below md
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // shortcuts tab isn't available on mobile — fall back without an extra render pass
  const activeTab = isMobile && tab === 'shortcuts' ? 'filters' : tab

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === '1' && !isMobile) setTab('shortcuts')
      if (e.key === '2') setTab('filters')
      if (e.key === '3') setTab('examples')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isMobile])

  const visibleTabs = isMobile ? TABS.filter(t => t.key !== 'shortcuts') : TABS

  return (
    <div className="p-5 cursor-pointer w-full max-w-[550px] space-y-4 rounded-border">
      {/* header / tabs */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          {visibleTabs.map(({ key, label, shortcut }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-sm cursor-pointer font-semibold transition outline-none ${
                activeTab === key ? 'text-accent' : 'text-subtle hover:text-accent-strong'
              }`}
            >
              <span className="hidden md:inline text-subtle font-mono">{shortcut}.</span> {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted">dmrkt</span>
      </div>

      {activeTab === 'shortcuts' && (
        <Section title="keyboard">
          <Row label="1 / 2 / 3" value="shortcuts / filters / examples" />
          <Row label="a / w / d" value="switch tab" />
          <Row label="shift + a / w / d" value="switch tab + reset filters" />
          <Row label="shift + c" value="connect wallet" />
          <Row label="s" value="run main action" />
          <Row label="i" value="focus search" />
          <Row label="l" value="focus list" />
          <Row label="?" value="open manual" />
          <Row label="o" value="my active orders" />
          <Row label="." value="view session txs" />
          <Row label="," value="open settings" />
          <Row label="esc / x" value="close modal" />
          <Row label="esc (toast up)" value="dismiss toast" />
          <Row label="esc (in search)" value="clear search input" />
        </Section>
      )}

      {activeTab === 'filters' && (
        <>
          <Section title="mine flag">
            <div className="flex flex-col gap-1 text-sm text-muted pb-1">
              <span>
                type <span className="text-accent font-mono">mine</span> to toggle per tab
              </span>
            </div>
            <Row label="orders *" value="items actionable by you – Buy, Sell, Cancel" />
            <Row label="nfts" value="owner = you" />
            <Row label="trades" value="buyer = you || seller = you" />
          </Section>

          <Section title="keywords">
            <Row label="mine" value="activate mine flag" copy="mine" />
            <Row label="me" value="replaced with your address" copy="maker=me" />
          </Section>

          <Section title="available fields">
            <div className="text-sm text-muted">
              any field in the details panel is filterable — match casing or use lowercase
            </div>
          </Section>

          <Section title="special syntax">
            <Row
              label="trait.type=sword"
              value="nft attribute trait.key=value"
              copy="trait.type="
            />
            <Row
              label="sortField=price sortDir=asc"
              value="sort (default desc)"
              copy="sortField=price sortDir=asc"
            />
          </Section>
        </>
      )}

      {activeTab === 'examples' && (
        <>
          <Section title="orders">
            <ExRow
              query="status=active trait.type=sword sortField=price"
              desc="active sword orders by highest price"
            />
            <ExRow query="maker=me status=active,cancelled" desc="your active + cancelled orders" />
            <ExRow query="mine side=bid status=active" desc="active bids on your tokens" />
          </Section>

          <Section title="nfts">
            <ExRow
              query="mine trait.type=elixir trait.rarity=epic,legendary"
              desc="your elixirs, epic or legendary"
            />
            <ExRow
              query="trait.type=sword trait.color=blood_red,cyber_blue"
              desc="swords, red or blue"
            />
          </Section>

          <Section title="trades">
            <ExRow query="seller=me sortField=price sortDir=asc" desc="your cheapest trades" />
            <ExRow query="buyer=me sortField=timestamp" desc="your most recent buys" />
          </Section>
        </>
      )}
    </div>
  )
}
