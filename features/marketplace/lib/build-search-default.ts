import { resolveValue } from '@/lib/dmrkt-indexer/actions/logic/param-mapper'

export function buildSearchDefault({
  activeFilters,
  account,
  isMine,
}: {
  activeFilters: Record<string, string[]>
  account?: string
  isMine: boolean
}) {
  console.log(Object.entries(activeFilters))
  const resolved = Object.entries(activeFilters)
    .map(([k, vals]) => `${k}=${vals.map(v => resolveValue(k, v)).join(',')}`)
    .join(' ')

  // console.log(resolved)
  const withAlias = account ? resolved.replaceAll(account, 'me') : resolved
  // console.log(withAlias)

  return isMine ? `mine ${withAlias}` : withAlias
}
