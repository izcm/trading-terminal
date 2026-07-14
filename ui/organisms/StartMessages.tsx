export function StartMessage() {
  return (
    <div className="flex flex-col gap-4 max-w-[380px] p-2 text-sm">
      <h2 className="text-base font-semibold text-accent-weak">Before you get started</h2>

      <p className="text-subtle">
        For the smoothest experience, connect your wallet and set your transfer/allowance approvals
        in <span className="text-accent-weak">Settings</span> (gear icon).
      </p>

      <p className="text-subtle">
        The marketplace only supports <span className="text-accent-weak">WETH</span>. If you
        don&apos;t hold any, orders in the feed will show as{' '}
        <span className="text-failure">Not fillable</span>.
      </p>

      <div className="text-subtle">
        Once connected, Settings will show:
        <ul className="list-disc pl-5 mt-1 space-y-0.5">
          <li>WETH balance</li>
          <li>Current approvals</li>
          <li>Actions to deposit WETH and update approvals</li>
        </ul>
      </div>
    </div>
  )
}
