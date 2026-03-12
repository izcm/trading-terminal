import { useState } from 'react'

import type { Listing } from '@/domain/listing'

type Props = {
  listing: Listing | null
}

export function ReceiptPanel({ listing }: Props) {
  // UI elements
  const [previewSrc, setPreviewSrc] = useState<string>('/placeholders/token-waiting.svg')
}
