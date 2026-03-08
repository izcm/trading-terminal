import type { Sale } from '@/domain/sale'

export const floor = <K extends keyof Sale>(sales: Sale[], key: K, value: Sale[K]) => {
  const filtered = sales.filter(sale => sale[key] === value)
  if (!filtered.length) return 0n

  const minWei = filtered.reduce((min, curr) => {
    const p = BigInt(curr.price)
    return p < min ? p : min
  }, BigInt(filtered[0].price))

  return minWei
}
