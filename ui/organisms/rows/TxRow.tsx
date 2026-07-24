import { useState } from 'react'

import type { Tx } from '@/app/providers/TxProvider'
import { timeAgo } from '@/lib/utils/time'
import { Copyable } from '@/ui/atoms'

const ERROR_TRUNCATE = 80

type Props = {
  tx: Tx
  onClick?: () => void
  disabled?: boolean // when anvil chain and no block explorer
}

export const LINK_LABELS: Record<string, string> = {
  'order filled': 'view trade',
  'order cancelled': 'view order',
}

export function TxRow({ tx, onClick, disabled }: Props) {
  const [expanded, setExpanded] = useState(false)
  const shortHash = `${tx.hash.slice(0, 6)}…${tx.hash.slice(-4)}`
  const error = tx.status === 'failed' ? tx.error : undefined
  const isTruncated = error && error.length > ERROR_TRUNCATE

  return (
    <div className="text-start text-sm" onClick={onClick}>
      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[auto_88px_80px_1fr_142px] sm:items-center sm:gap-6 p-4">
        <div className="flex items-center gap-2 sm:contents">
          <StatusIcon status={tx.status} />

          <div className="whitespace-nowrap">
            <Copyable value={tx.hash} className="text-accent">
              {shortHash}
            </Copyable>
          </div>

          <span className="text-muted whitespace-nowrap ml-auto sm:ml-0 sm:text-right">
            {timeAgo(tx.createdAt)}
          </span>
        </div>

        <span className="text-subtle truncate">{tx.label}</span>

        <button
          disabled={disabled}
          className={`flex items-center justify-between gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${tx.status !== 'success' ? 'invisible' : ''}`}
        >
          <div className="text-accent whitespace-nowrap">
            {LINK_LABELS[tx.label] ?? 'block explorer'}
          </div>

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

      {error && (
        <p className="px-4 pb-3 text-xs text-red-400/80 leading-relaxed">
          {expanded || !isTruncated ? error : `${error.slice(0, ERROR_TRUNCATE)}…`}
          {isTruncated && (
            <button
              className="ml-1 text-red-400 underline underline-offset-2 cursor-pointer"
              onClick={e => {
                e.stopPropagation()
                setExpanded(v => !v)
              }}
              disabled={disabled}
            >
              {expanded ? 'see less' : 'see more'}
            </button>
          )}
        </p>
      )}
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
