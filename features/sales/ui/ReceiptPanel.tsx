import { useState } from 'react'

import { Listing } from '@/lib/dmrkt-indexer/types/listing'

type Props = {
  listing: Listing | null
}

export function ReceiptPanel({ listing }: Props) {
  // UI elements
  const [previewSrc, setPreviewSrc] = useState<string>('/placeholders/token-waiting.svg')
}
