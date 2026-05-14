'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { NFTCollection } from '@/domain/nft-collection'
import { getDmrktNFTCollections } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'
import { getBaseUrl } from '@/lib/dmrkt-indexer/config'
import { Spinner } from '@/ui/atoms/Spinner'

const CHAIN_ID = 31337

type IndexingStatus = {
  nfts: { total: number; indexed: number; done: boolean }
  settlements: { total: number; reconstructed: number }
}

function Bar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div className="h-px w-full bg-white/8 rounded-full overflow-hidden">
      <div
        className="h-full bg-accent/50 rounded-full transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function Page() {
  const [nftCollections, setNFTCollections] = useState<NFTCollection[]>([])
  const [status, setStatus] = useState<IndexingStatus | null>(null)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>
    const poll = () => {
      getDmrktNFTCollections({ filters: { chainId: [String(CHAIN_ID)] } }).then(res => {
        if (res.ok && res.data.items.length > 0) setNFTCollections(res.data.items)
        else if (!res.ok) setError(res.error)
        else id = setTimeout(poll, 3200)
      })
    }
    poll()
    return () => clearTimeout(id)
  }, [])

  // demo contains one nft collection
  const first = nftCollections[0]

  // has indexer
  // 1. backfilled nfts
  // 2. are there recorded settlements?
  // 3. have indexer reconstructed full settlements receipts?
  const isDone =
    status?.nfts.done &&
    status.settlements.total > 0 &&
    status.settlements.reconstructed === status.settlements.total

  // poll progress every 2 seconds
  useEffect(() => {
    if (!first || isDone) return
    const poll = async () => {
      try {
        const res = await fetch(
          `${getBaseUrl()}/api/healthcheck?chainId=${CHAIN_ID}&collection=${first.address}`
        )
        if (res.ok) setStatus(await res.json())
      } catch {
        /* retry next tick */
      }
    }
    poll()
    const id = setInterval(poll, 2000)
    return () => clearInterval(id)
  }, [first, isDone])

  const dmrktBanner = () => (
    <h1
      className="text-accent glow"
      style={{ fontSize: '4rem', letterSpacing: '-0.03em', fontWeight: 800 }}
    >
      d | mrkt
    </h1>
  )

  const bannerClasses = 'h-screen flex flex-col gap-12 items-center justify-center fade-in'

  // show banner and loading spinner when no collection is indexed
  if (!first && !error) {
    return (
      <div className={`${bannerClasses} fade-in`}>
        {dmrktBanner()}
        <Spinner size={20} />
      </div>
    )
  }

  // collection has been indexed => show backfill progress and settlement count
  return (
    <div className={bannerClasses}>
      {dmrktBanner()}
      <div className="flex flex-col gap-5 w-56">
        {status ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className={status.nfts.done ? 'text-accent' : 'opacity-40'}>nfts</span>
                <span className="opacity-25 tabular-nums">
                  {`${status.nfts.indexed} / ${status.nfts.total}`}
                </span>
              </div>
              <Bar current={status.nfts.indexed} total={status.nfts.total} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span
                  className={
                    status.settlements.reconstructed === status.settlements.total
                      ? 'text-accent'
                      : 'opacity-40'
                  }
                >
                  settlements
                </span>
                <span className="opacity-25 tabular-nums">
                  {status.settlements.reconstructed} / {status.settlements.total}
                </span>
              </div>
              <Bar current={status.settlements.reconstructed} total={status.settlements.total} />
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <Spinner size={16} />
          </div>
        )}

        {isDone && (
          <div className="flex flex-col gap-2 pt-4">
            {error && <p className="text-sm text-red-400">{error}</p>}
            {nftCollections.map(c => (
              <Link
                key={`${c.chainId}:${c.address}`}
                href={`/${c.chainId}/${c.address}`}
                className="btn btn-primary text-center"
              >
                enter {c.name ?? c.address.slice(0, 6) + '...'} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
