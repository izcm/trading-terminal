'use client'

import { NFTCollection } from '@/domain/nft-collection'
import { getDmrktNFTCollections } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'
import { Spinner } from '@/ui/atoms/Spinner'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [collections, setCollections] = useState<NFTCollection[]>([])

  useEffect(() => {
    const run = async () => {
      setIsLoading(true)

      const res = await getDmrktNFTCollections({
        filters: { chainId: ['31337'] },
      })

      if (res.ok) setCollections(res.data.items)
      else setError(res.error)

      setIsLoading(false)
    }

    run()
  }, [])

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-xl text-accent">d | mrkt</h1>

      {/* state */}
      {isLoading && <Spinner size={24} />}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* collections */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {collections.map(c => (
          <Link
            key={`${c.chainId}:${c.address}`}
            href={`/${c.chainId}/${c.address}`}
            className="btn btn-menu text-center"
          >
            {c.name ?? c.address.slice(0, 6) + '...'}
          </Link>
        ))}
      </div>

      {/* empty */}
      {!isLoading && !error && collections.length === 0 && (
        <p className="text-sm opacity-60">no collections</p>
      )}
    </div>
  )
}
