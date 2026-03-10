import { months } from '@/domain/constants/months'

export type TimeUnit = 'hour' | 'day' | 'month' | 'week'

export const tsShort = (ts: number) => {
  const d = new Date(ts)

  const month = d.toLocaleString('en-US', { month: 'short' })
  const day = String(d.getDate()).padStart(2, '0')
  const time = d.toTimeString().slice(0, 5)

  return `${month} ${day} ${time}`
}

export const tsSuperShort = (ts: number) => {
  const d = new Date(ts)

  const month = d.toLocaleString('en-US', { month: 'short' })
  const day = String(d.getDate()).padStart(2, '0')

  return `${month} ${day}`
}

export const tsLong = (ts: number) => {
  const d = new Date(ts)

  const yy = String(d.getUTCFullYear()).slice(-2)
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const min = String(d.getUTCMinutes()).padStart(2, '0')

  return `${yy}.${mm}.${dd} ${hh}:${min}`
}

export const tsMonthNameUTC = (ts: number) => {
  return months[new Date(ts).getUTCMonth()]
}

// never used for UI display only for charts => always UTC
export const timeKey = (ts: number, unit: 'hour' | 'day' | 'month' | 'week') => {
  const d = new Date(ts)

  switch (unit) {
    case 'hour':
      return d.toISOString().slice(0, 13) // 2026-01-16T05
    case 'day':
      return d.toISOString().slice(0, 10) // 2026-01-16
    case 'month':
      return `${d.getUTCFullYear()}-${d.getUTCMonth()}`
  }
}
