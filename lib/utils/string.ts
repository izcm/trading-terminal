export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const capitalizeWords = (s: string) =>
  s
    .split(' ')
    .map(w => capitalize(w))
    .join(' ')
