'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { NFTCollection } from '@/domain/nft-collection'
import { getDmrktNFTCollection } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import { getBaseUrl } from '@/lib/dmrkt-indexer/config'
import { Spinner } from '@/ui/atoms/Spinner'

export default function Page() {
  const [collection, setCollection] = useState<NFTCollection>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (collection) return

    let id: ReturnType<typeof setTimeout>
    const controller = new AbortController()
  }, [])

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
  return <div className={bannerClasses}>{dmrktBanner()}</div>
}
