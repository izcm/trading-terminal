import Link from 'next/link'

import { getDmrktNFTCollections } from '@/lib/dmrkt-indexer/actions/dmrkt-page.get'
import { ImageRow } from '@/ui/organisms/rows/ImageRow'
import { NFT_PLACEHOLDER_IMAGE } from '@/domain/constants/placeholders'
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
        <div>
          <p>
            Welcome to this live marketplace simulation. Pre-populated orders are created and signed
            programatically through foundry scripting.
          </p>
          <p>Fully deterministic, fully reproducable.</p>
        </div>
        <p>
          You can run the whole simulation and full-stack application dockerized on your local
          machine; github_repo.
        </p>
        <p>Provided by a2zblock.</p>
      </div>

      <SimulationState chainId={SEPOLIA_CHAIN_ID} collections={collectionCall.data.items} />
    </div>
  )
}
