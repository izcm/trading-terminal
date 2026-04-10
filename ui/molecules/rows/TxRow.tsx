import type { Tx, TxLabel } from '@/app/providers/TxProvider'
import { hhmm } from '@/domain/shared/utils/time'
import { Copyable } from '@/ui/atoms'

type Props = {
  tx: Tx
  onClick?: () => void
}

export const LINK_LABELS: Record<TxLabel, string> = {
  'order filled': 'view sale',
  'order cancelled': 'view cancelled',
  transaction: 'view receipt',
}
export function TxRow({ tx, onClick }: Props) {
  const shortHash = `${tx.hash.slice(0, 6)}…${tx.hash.slice(-4)}`

  return (
    <div className="flex text-start gap-6 justify-between p-4 text-sm" onClick={onClick}>
      <StatusIcon status={tx.status} />

      <div className="shrink-0 w-22">
        <Copyable value={tx.hash} className="text-accent">
          {shortHash}
        </Copyable>
      </div>

      <span className="text-muted">{hhmm(tx.createdAt)}</span>

      <span className="flex-1 text-muted">{tx.label}</span>

      <button className="basis-[150px] flex items-center justify-between gap-2 shrink-0 cursor-pointer">
        <div className="text-accent">{LINK_LABELS[tx.label]}</div>

        <svg
          className="w-3.5 h-3.5 text-accent"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
      </button>
    </div>
  )
}

function StatusIcon({ status }: { status: Tx['status'] }) {
  if (status === 'success') {
    return (
      <svg
        className="w-4 h-4 shrink-0 text-green-400"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path d="M5 8.5l2 2 4-4" />
      </svg>
    )
  }

  if (status === 'failed') {
    return (
      <svg
        className="w-4 h-4 shrink-0 text-red-400"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
      </svg>
    )
  }

  return (
    <svg
      className="w-4 h-4 shrink-0 text-accent animate-spin"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M8 1.5A6.5 6.5 0 1 1 1.5 8" />
    </svg>
  )
}
