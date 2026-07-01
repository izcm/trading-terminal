import Link from 'next/link'

import { getDmrktNFTCollections } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'
import { SimulationState } from '@/features/SimulationState'

const SEPOLIA_CHAIN_ID = 11155111

export default async function Page() {
  const collectionCall = await getDmrktNFTCollections({
    filters: { chainId: [SEPOLIA_CHAIN_ID.toString()] },
  })

  const parentClasses = 'min-h-screen flex flex-col gap-4 items-center justify-center fade-in'

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

  return (
    <div className={parentClasses}>
      {dmrktBanner()}
      <div className="flex flex-col gap-4 text-muted w-3/4">
        <p className="text-accent-weak">Welcome to IzBlock's live marketplace simulation.</p>
        <p>
          Pre-populated orders are created, signed, and executed programmatically via Foundry
          scripts. The process is deterministic, making every run fully reproducible.
        </p>
        <p>The simulation and full-stack application can also be run locally; github_repo.</p>
      </div>

      <SimulationState chainId={SEPOLIA_CHAIN_ID} collections={collectionCall.data.items} />
    </div>
  )
}
