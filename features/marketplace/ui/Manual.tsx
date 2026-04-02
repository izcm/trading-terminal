function Row({ label, value, copy }: { label: string; value: React.ReactNode; copy?: string }) {
  return (
    <div
      className={`
        flex justify-between items-center py-1 gap-4
        ${copy ? 'cursor-pointer hover:text-accent/80 transition' : ''}
      `}
      onClick={() => copy && navigator.clipboard.writeText(copy)}
    >
      {/* LEFT = primary */}
      <span className="text-sm font-mono text-accent">{label}</span>

      {/* RIGHT = secondary */}
      <span className="text-sm text-muted text-right">{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-soft pt-4 space-y-2">
      <h3 className="text-[10px] text-muted uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  )
}

export function Manual() {
  return (
    <div className="card p-5 w-full max-w-[550px] space-y-4">
      {/* header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold">Manual</h2>
        <span className="text-xs text-muted">dmrkt</span>
      </div>

      {/* keyboard */}
      <Section title="keyboard">
        <Row label="f" value="feed" />
        <Row label="e" value="explore" />
        <Row label="s" value="sales" />
        <Row label="a" value="run action" />
        <Row label="g" value="focus list" />
        <Row label="shift + w" value="connect wallet" />
      </Section>

      {/* search */}
      <Section title="search">
        <Row label="me" value="your address" copy="maker=me" />
        <Row label="mine" value="your tokens only" copy="mine" />
      </Section>

      {/* examples */}
      <Section title="examples">
        <Row label="maker=me" value="orders created by you" copy="maker=me" />
        <Row label="mine side=bid" value="bids on your tokens" copy="mine side=bid" />
        <Row label="collection=0x..." value="filter collection" copy="collection=0x..." />
        <Row label="tokenId=123" value="specific token" copy="tokenId=123" />
      </Section>
    </div>
  )
}
