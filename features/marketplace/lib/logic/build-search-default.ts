export function buildSearchDefault({
  activeFilters,
  account,
  isMine,
}: {
  activeFilters: Record<string, string[]>
  account?: string
  isMine: boolean
}) {
  const resolved = Object.entries(activeFilters)
    .map(([k, vals]) => `${k}=${vals}`)
    .join(' ')

  const withAlias = account ? resolved.replaceAll(account, 'me') : resolved

  return isMine ? `mine ${withAlias}` : withAlias
}
