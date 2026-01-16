import { months } from '@/data/constants/months'

export const formatTs = (ts: number) => {
  const date = new Date(Number(ts))

  const yy = String(date.getFullYear()).slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  return `${yy}.${mm}.${dd} ${hh}:${min}`
}

export const tsMonthName = (ts: number) => {
  return months[new Date(ts).getMonth()]
}
