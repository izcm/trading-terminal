type NFTAttribute = {
  trait_type: string
  value: string
}

type Props = {
  image: string
  name?: string
  attributes?: NFTAttribute[]
}

export function NFTSummary({ image, name, attributes }: Props) {
  return (
    <div className="shrink-0 flex justify-center overflow-hidden bg-black/25">
      {/* preview */}
      <img src={image} alt="token preview" className="w-full h-full object-cover" />
    </div>
  )
}
