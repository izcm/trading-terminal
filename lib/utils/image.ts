const isSvg = (src?: string): boolean => {
  return !!src && src.startsWith('data:image/svg')
}

const inlineSvgToBlobUrl = (src: string): string => {
  // removes prefix so we only have raw  <svg ...>
  const svg = src.replace('data:image/svg+xml;utf8,', '')

  const blob = new Blob([svg], { type: 'image/svg+xml' })

  return URL.createObjectURL(blob)
}

// ❗ TODO: SANITIZE FOR XSS @resvg/resvg-js
export const resolveImage = async (src: string): Promise<string> => {
  if (!src) return ''

  // ONLY convert inline SVGs
  if (isSvg(src)) return inlineSvgToBlobUrl(src)

  // EVERYTHING ELSE: DO NOT FETCH
  return src
}
