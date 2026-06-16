'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { NFTCollection } from '@/domain/nft-collection'
import { getDmrktNFTCollection } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
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
        className="h-full bg-accent rounded-full transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function Page() {
  const [collection, setCollection] = useState<NFTCollection>()
  const [status, setStatus] = useState<IndexingStatus>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (collection) return

    let id: ReturnType<typeof setTimeout>
    const controller = new AbortController()

    const getCollection = async () => {
      // healthcheck returns chainId + address of first indexed collection
      // note: there is only one demo collection per today
      try {
        const res = await fetch(`${getBaseUrl()}/healthcheck`, {
          signal: controller.signal,
        })

        const collection = await res.json()
        if (collection) return setCollection(collection)

        id = setTimeout(getCollection, 3200)
      } catch {
        if (controller.signal.aborted) return

        // naively assuming every error is indexer starting
        setError('awaiting indexer')
        id = setTimeout(getCollection, 3200)
      }
    }

    getCollection()
    return () => {
      controller.abort()
      clearTimeout(id)
    }
  }, [])

  // isDone ? show link to marketplace
  const [isDone, setIsDone] = useState(false)

  // poll progress every 2 seconds
  useEffect(() => {
    if (!collection || isDone) return
    const controller = new AbortController()

    const poll = async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/healthcheck/${CHAIN_ID}/${collection.address}`, {
          signal: controller.signal,
        })
        if (res.ok) setStatus(await res.json())
      } catch {
        /* retry next tick */
      }
    }
    poll()

    const id = setInterval(poll, 2000)
    return () => {
      controller.abort()
      clearInterval(id)
    }
  }, [collection, isDone])

  // has indexer
  // 1. backfilled nfts?
  // 2. are there recorded settlements?
  // 3. have indexer reconstructed full settlements receipts?
  const fullyPolled =
    status?.nfts.done &&
    status.settlements.total > 0 &&
    status.settlements.reconstructed === status.settlements.total

  // collection might not have name indexed at page load
  // if so -> do extra fetch on poll finish
  useEffect(() => {
    if (!fullyPolled || collection?.name !== 'unknown collection') {
      if (fullyPolled) setIsDone(true)
      return
    }
    getDmrktNFTCollection(CHAIN_ID, collection.address).then(res => {
      if (res.ok) setCollection(res.data)
      setIsDone(true)
    })
  }, [fullyPolled, collection?.name])

  const dmrktBanner = () => (
    <h1
      className="text-accent glow"
      style={{ fontSize: '4rem', letterSpacing: '-0.03em', fontWeight: 800 }}
    >
      d | mrkt
    </h1>
  )

  const bannerClasses = 'h-screen flex flex-col gap-12 items-center justify-center fade-in'

  const [dots, setDots] = useState('.')
  useEffect(() => {
    const id = setInterval(() => setDots(d => (d.length >= 3 ? '.' : d + '.')), 500)
    return () => clearInterval(id)
  }, [])

  // show banner and loading spinner when no collection is indexed
  if (!collection) {
    return (
      <div className={bannerClasses}>
        {dmrktBanner()}
        <p className="text-sm opacity-40">
          {error ?? 'awaiting collection'}
          <span className="inline-block w-4">{dots}</span>
        </p>
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
                <span className={isDone ? 'text-accent' : 'opacity-40'}>nfts</span>
                <span className="opacity-25 tabular-nums">
                  {`${status.nfts.indexed} / ${status.nfts.total}`}
                </span>
              </div>
              <Bar current={status.nfts.indexed} total={status.nfts.total} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className={isDone ? 'text-accent' : 'opacity-40'}>trades</span>
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

        {isDone && collection && (
          <div className="flex flex-col gap-2 pt-4">
            <Link
              href={`/${collection.chainId}/${collection.address}`}
              className="btn btn-primary text-center"
            >
              enter {collection.name ?? collection.address.slice(0, 6) + '...'} →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
