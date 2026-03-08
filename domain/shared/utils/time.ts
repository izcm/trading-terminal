import { months } from '@/domain/constants/months'

export type TimeUnit = 'hour' | 'day' | 'month' | 'week'

export const formatTsUTC = (ts: number) => {
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
    case 'week': {
      const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))

      // ISO: week starts Monday
      const day = date.getUTCDay() || 7
      date.setUTCDate(date.getUTCDate() + 4 - day)

      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
      const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)

      return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
    }
    case 'month':
      return `${d.getUTCFullYear()}-${d.getUTCMonth()}`
  }
}
