import { getDmrktCount } from '@/lib/dmrkt-indexer/actions/dmrkt.get'
import { getDmrktNFTCollections } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'

import { SimulationState } from '@/features/SimulationState'
import ProgressPage from '@/ui/organisms/demo/ProgressPage'

const SEPOLIA_CHAIN_ID = 11155111

export default async function Page() {
  const IS_DEMO = process.env.NEXT_PUBLIC_MODE === 'DEMO'

  // show healthcheck / indexing progress bars
  if (IS_DEMO) {
    return <ProgressPage />
  }

  const collectionCall = await getDmrktNFTCollections({
    filters: { chainId: [SEPOLIA_CHAIN_ID.toString()] },
  })

  const parentClasses =
    'min-h-screen flex flex-col gap-4 max-w-4xl items-center justify-center mx-auto fade-in'

  if (!collectionCall.ok) {
    return (
      <div className={parentClasses}>
        <span className="text-failure">Could not fetch collection: {collectionCall.error}</span>
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
        count('settlements/wallets'),
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
      <div className="flex flex-col items-center gap-4 my-2  text-muted">
        <p className="text-accent/80">Welcome to IzBlocks&apos; live marketplace simulation.</p>

        <p>
          Pre-populated orders are created, signed, and executed programmatically. The process is
          deterministic, making every run fully reproducible.
        </p>

        <p>
          The linked walkthrough shows an early, simpler version of the simulation. A more recent
          version, alongside the indexer and frontend app, can be run locally;{' '}
          <a
            href="https://github.com/izcm/dmrkt-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/90 underline"
          >
            clone this repo
          </a>
          .
        </p>

        <div className="flex gap-3">
          <a
            href="https://www.youtube.com/watch?v=YXtO_S2THTg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/90 underline"
          >
            walkthrough
          </a>
          <span className="text-muted">·</span>
          <a
            href="https://sepolia.etherscan.io/address/0xA1b083adA5Ff1252aCb6b119813B5054D3eB6AEB"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/90 underline"
          >
            marketplace
          </a>
        </div>
      </div>

      <SimulationState
        chainId={SEPOLIA_CHAIN_ID}
        collections={collectionCall.data.items}
        collectionStats={collectionStats}
      />
    </div>
  )
}
