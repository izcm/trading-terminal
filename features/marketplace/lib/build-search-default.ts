import { denormalizeKeys, toSearchParams } from '@/lib/dmrkt-indexer/actions/logic/param-mapper'

export function buildSearchDefault({
  activeFilters,
  account,
  isMine,
}: {
  activeFilters: Record<string, string[]>
  account?: string
  isMine: boolean
}) {
  const base = decodeURIComponent(toSearchParams(activeFilters).toString())
    .replaceAll('+', '_')
    .replaceAll('&', ' ')

  const normalized = denormalizeKeys(base)

  const withAlias = account ? normalized.replaceAll(account, 'me') : normalized

  return isMine ? `myTokens ${withAlias}` : withAlias
}
