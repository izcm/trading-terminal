export const topNBy = <T>(map: Map<string, T>, pick: (value: T) => number | bigint, n: number) => {
  return Array.from(map)
    .sort(([, a], [, b]) => {
      const av = pick(a)
      const bv = pick(b)

      if (typeof a === 'bigint' && typeof b === 'bigint') {
        return Number(bv > av) - Number(bv < av)
      }

      return Number(bv) - Number(av)
    })
    .slice(0, n)
}
