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
    <div className="flex flex-col gap-4 justify-center overflow-hidden">
      <img src={image} className="card object-cover bg-black/25" alt="token preview" />
      <div>attributes here</div>
    </div>
  )
}
