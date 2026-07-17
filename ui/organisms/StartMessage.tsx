export function StartMessage() {
  return (
    <div className="flex flex-col gap-4 max-w-[400px] p-2 text-sm">
      <h2 className="text-base font-semibold text-accent-weak">Before you get started</h2>

      <p className="text-subtle">
        For the smoothest experience, connect your wallet and set your transfer/allowance approvals
        in <span className="text-accent-weak">Settings</span>{' '}
        <span className="whitespace-nowrap">
          (gear icon, or press <span className="text-accent-weak">,</span>).
        </span>
      </p>

      <p className="text-subtle">
        The marketplace only supports <span className="text-accent-weak">WETH</span>. If you
        don&apos;t hold any, orders in the feed will show as{' '}
        <span className="text-failure">Not fillable</span>.
      </p>

      <div className="text-subtle">
        From Settings you can:
        <ul className="list-disc pl-5 mt-1 space-y-0.5">
          <li>View WETH balance and current approvals</li>
          <li>Deposit WETH and update approvals</li>
        </ul>
      </div>

      <p className="text-subtle">
        This app is built for keyboard use — press <span className="text-accent-weak">?</span>{' '}
        anytime to see the full list of shortcuts.
      </p>
    </div>
  )
}
