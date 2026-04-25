import { toSearchParams } from './param-mapper'

function setDefault(q: URLSearchParams, key: string, value: string) {
  if (!q.has(key)) q.set(key, value)
}

export function buildQuery({
  filters,
  cursor,
  includes = [],
}: {
  filters: Record<string, string[]>
  cursor?: string | null
  includes?: string[]
}): URLSearchParams {
  const query = toSearchParams(filters)

  if (cursor) query.append('cursor', cursor)

  includes.forEach(inc => query.append('include', inc))

  if (!filters.sortField) setDefault(query, 'sortField', 'createdAt')

  return query
}
