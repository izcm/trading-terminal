import { getDmrktCount } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import { getDmrktNFTCollections } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

import { SimulationState } from '@/features/SimulationState'
import { NFTCollection } from '@/domain/nft-collection'

const SEPOLIA_CHAIN_ID = 11155111

export default async function Page() {
  const collectionCall = await getDmrktNFTCollections({
    filters: { chainId: [SEPOLIA_CHAIN_ID.toString()] },
  })

  const parentClasses =
    'min-h-screen flex flex-col gap-4 max-w-4xl items-center justify-center mx-auto fade-in'

  if (!collectionCall.ok) {
    return (
      <div className={parentClasses}>
        <span className="text-failure">Couldn't fetch collection: {collectionCall.error}</span>
      </div>
    )
  }

  const dmrktBanner = () => (
    <h1
      className="text-accent glow"
      style={{ fontSize: '4rem', letterSpacing: '-0.03em', fontWeight: 800 }}
    >
      d | mrkt
    </h1>
  )

  const collections = collectionCall.data.items

  const unwrapCount = (r: Awaited<ReturnType<typeof getDmrktCount>>) =>
    r.ok ? r.data : "couldn't count"

  const collectionStatsList = await Promise.all(
    collections.map(async c => {
      const count = (countOf: string, filters?: Record<string, string[]>) =>
        getDmrktCount(countOf, {
          chainId: [c.chainId.toString()],
          collection: [c.address],
          ...filters,
        })

      const [activeOrders, trades, traders] = await Promise.all([
        count('orders', { status: ['active'] }),
        count('settlements'),
        count('orders'),
      ])

      return [
        c.address,
        {
          activeOrders: unwrapCount(activeOrders),
          trades: unwrapCount(trades),
          traders: unwrapCount(traders),
        },
      ] as const
    })
  )

  const collectionStats = Object.fromEntries(collectionStatsList)

  return (
    <div className={parentClasses}>
      {dmrktBanner()}
      <div className="flex flex-col gap-4 my-2 text-muted">
        <p className="text-accent-weak">Welcome to IzBlocks' live marketplace simulation.</p>
        <p>
          Pre-populated orders are created, signed, and executed programmatically via Foundry
          scripts. The process is deterministic, making every run fully reproducible.
        </p>
        <p>The simulation and full-stack application can also be run locally; github_repo.</p>
      </div>

      <SimulationState
        chainId={SEPOLIA_CHAIN_ID}
        collections={collectionCall.data.items}
        collectionStats={collectionStats}
      />
    </div>
  )
}
