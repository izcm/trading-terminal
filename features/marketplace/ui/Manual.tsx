'use client'

import { useEffect, useState } from 'react'

function Row({ label, value, copy }: { label: string; value: React.ReactNode; copy?: string }) {
  return (
    <div
      className={`
        flex justify-between items-center py-1 gap-4
        ${copy ? ' hover:text-accent-string transition' : ''}
      `}
      onClick={() => copy && navigator.clipboard.writeText(copy)}
    >
      <span className="text-sm font-mono text-accent">{label}</span>
      <span className="text-sm text-muted text-right">{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-soft pt-4 space-y-2">
      <h3 className="text-[11px] text-muted uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  )
}

type Tab = 'manual' | 'filters'

const TABS: { key: Tab; label: string; shortcut: string }[] = [
  { key: 'manual', label: 'manual', shortcut: '1' },
  { key: 'filters', label: 'filters', shortcut: '2' },
]

export function Manual() {
  const [tab, setTab] = useState<Tab>('manual')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === '1') setTab('manual')
      if (e.key === '2') setTab('filters')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="card p-5 cursor-pointer w-full max-w-[550px] space-y-4">
      {/* header / tabs */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          {TABS.map(({ key, label, shortcut }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-sm cursor-pointer font-semibold transition ${
                tab === key ? 'text-accent' : 'text-muted hover:text-accent-strong'
              }`}
            >
              <span className="text-muted font-mono">{shortcut}.</span> {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted">dmrkt</span>
      </div>

      {tab === 'manual' && (
        <Section title="keyboard">
          <Row label="1 / 2" value="manual / filters" />
          <Row label="f / e / s" value="switch tab" />
          <Row label="shift + f / e / s" value="switch tab + reset filters" />
          <Row label="a" value="run action" />
          <Row label="l" value="focus list" />
          <Row label="shift + w" value="connect wallet" />
        </Section>
      )}

      {tab === 'filters' && (
        <>
          <Section title="keywords">
            <Row label="me" value="your address" copy="maker=me" />
            <Row label="myTokens / mytokens" value="your tokens only" copy="myTokens" />
          </Section>

          <Section title="AVAILABLE FIELDS">
            <div className="flex flex-col gap-1 text-sm text-muted pb-1">
              <span>sidepanel fields per tab — match casing or use lowercase</span>
              <span className="text-accent/80 text-xs">
                explore: token attributes only (trait, value)
              </span>
            </div>

            <Row label="maker=<address>" value="orders by maker" copy="maker=" />
            <Row label="side=ask|bid" value="order side" copy="side=ask" />
            <Row
              label="status=active|filled|cancelled"
              value="order status"
              copy="status=active,filled,cancelled"
            />
            <Row label="tokenId=123" value="specific token" copy="tokenId=" />
            <Row label="trait=rarity value=epic" value="trait filter" copy="trait= value=" />
            <Row label="sortField=timestamp" value="sort by field" copy="sortField=timestamp" />
          </Section>

          <Section title="examples">
            <p className="text-[10px] text-muted uppercase tracking-widest pb-1">feed</p>

            <Row
              label="mytokens side=bid status=active "
              value="active bids on your tokens"
              copy="mytokens side=bid status=active"
            />

            <Row
              label="side=ask trait= "
              value="active bids on your tokens"
              copy="mytokens side=bid status=active"
            />

            <p className="text-[10px] text-muted uppercase tracking-widest pt-2 pb-1">sales</p>
            <Row
              label="seller=me trait=rarity,color value=rare,aqua_blue"
              value="your sales"
              copy="seller=me"
            />
          </Section>
        </>
      )}
    </div>
  )
}
