import { months } from '@/domain/constants/months'

export type TimeUnit = 'hour' | 'day' | 'month' | 'week'

export const tsShort = (ts: number) => {
  const p = parts(ts)
  return `${p.month} ${p.day} ${p.time}`
}

export const tsSuperShort = (ts: number) => {
  const p = parts(ts)
  return `${p.month} ${p.day}`
}

export const tsLong = (ts: number) => {
  const p = parts(ts)
  return `${p.yy}.${p.mm}.${p.dd} ${p.hh}:${p.min}`
}

export const tsMonthNameUTC = (ts: number) => {
  return months[new Date(ts).getUTCMonth()]
}

const parts = (ts: number) => {
  const d = new Date(ts)

  return {
    month: d.toLocaleString('en-US', { month: 'short' }),
    day: String(d.getDate()).padStart(2, '0'),
    yy: String(d.getUTCFullYear()).slice(-2),
    mm: String(d.getUTCMonth() + 1).padStart(2, '0'),
    dd: String(d.getUTCDate()).padStart(2, '0'),
    hh: String(d.getUTCHours()).padStart(2, '0'),
    min: String(d.getUTCMinutes()).padStart(2, '0'),
    time: d.toTimeString().slice(0, 5),
  }
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
