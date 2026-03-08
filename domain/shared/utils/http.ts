import { Result } from '../types/http'

export const unwrap = <T>(r: Result<T>): T => {
  if (!r.ok) throw new Error(r.error)
  return r.data
}
