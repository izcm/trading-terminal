export type Result<T> = { ok: true; data: T } | { ok: false; error: string }

export type Page<T> = {
  items: T[]
  cursor: string | null
}

export const unwrap = <T>(r: Result<T>): T => {
  if (!r.ok) throw new Error(r.error)
  return r.data
}
