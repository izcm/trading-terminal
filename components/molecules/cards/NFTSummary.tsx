type NFTAttribute = {
  trait_type: string
  value: string
}

type Props = {
  image?: string
  name?: string
  attributes?: NFTAttribute[]
}

export function NFTSummary({ image = '/placeholders/token-waiting.svg', name, attributes }: Props) {
  return (
    <div className="shrink-0 flex justify-center overflow-hidden rounded-xl bg-black/25">
      {/* preview */}
      <img src={image} alt="token preview" className="object-cover" />
    </div>
  )
}
