'use client'

export default function CollectionPage({ params }: { params: { address: string } }) {
  const { address } = params

  const mockCollection = {
    name: 'Kitz Test Collection',
    address: '0x123abc',
    supply: 2025,
    royalty: 5,
    engine: 'AMM + Orderbook',
  }

  const mockTokens = [
    { tokenId: 42, amm: 0.38, ob: 0.42 },
    { tokenId: 69, amm: 0.41, ob: 0.47 },
    { tokenId: 1337, amm: 0.5, ob: 0.55 },
  ]

  const engineStats = {
    curve: 'Linear',
    k: 0.01,
    poolNFTs: 12,
    poolETH: 24.5,
    listings: 3,
  }

  const events = [
    { time: '03:12', type: 'POOL_BUY', tokenId: 69, price: 0.41 },
    { time: '10:08', type: 'ORDER_EXEC', tokenId: 42, price: 0.44 },
    { time: '22:31', type: 'POOL_SELL', tokenId: 1337, price: 0.49 },
    { time: '1:14h', type: 'ORDER_CANCEL', tokenId: 42 },
  ]

  return (
    <main className="w-full max-w-2xl mx-auto flex flex-col">
      <div className="border rounded-lg border-default w-2xl py-4">
        <div className="font-mono">
          COLLECTION: {mockCollection.name}
          <br />
          ADDR: {mockCollection.address} • TOKEN SUPPLY: {mockCollection.supply}
          <br />
          ROYALTY: {mockCollection.royalty}% • ENGINE: {mockCollection.engine}
        </div>
      </div>
    </main>
  )
}
