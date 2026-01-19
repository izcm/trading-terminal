export const addrDisplay = (addr: `0x${string}`) => {
  return `${addr.slice(1, 5)}..${addr.slice(-3)}`
}
