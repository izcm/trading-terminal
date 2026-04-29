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

export const tsMonthNameUTC = (ts: number) => months[new Date(ts).getUTCMonth()]

export const hhmm = (ts: number) => {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
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

export const timeAgo = (ts: number): string => {
  const secs = Math.floor((Date.now() - ts) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
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
