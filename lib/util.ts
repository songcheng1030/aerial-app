export const fileName = (str: string): string => {
  const parts = str.split('/')
  const filename = parts[parts.length - 1]
  return filename.split('?')[0]
}

export const firstOrSelf = (x: string | string[] | undefined) => (Array.isArray(x) ? x[0] : x)

export const addOneYear = (date: Date): Date =>
  new Date(new Date(date).setFullYear(date.getFullYear() + 1))

const numberWithCommas = (n: number | string) => {
  const parts = n.toString().split('.')
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? `.${parts[1]}` : '')
}

/**
 * Mostly used to format prices.
 * @param value
 * @param decimal
 * @returns
 */
export const formattedNumber = (value: number, decimal?: number) => {
  if (!value || typeof value !== 'number') return null
  return numberWithCommas(value.toFixed(decimal))
}
