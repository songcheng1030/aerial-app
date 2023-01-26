import { ZCommon, ZOption, ZPreferred, ZSafe } from './schema'

export interface Shareholder {
  type: 'SAFE' | 'Preferred' | 'Option' | 'Common'
  data: Partial<ZCommon & ZPreferred & ZOption & ZSafe>
  id: string
}

const plus = (x: number, y: number) => x + y

export const extractEquityData = (shareholders: Shareholder[]) => {
  const totalShares = shareholders.map((s) => s.data.shares?.value ?? 0).reduce(plus, 0)

  const totalFunding = shareholders.map((s) => s.data.investment?.value ?? 0).reduce(plus, 0)

  const commonShares = shareholders
    .filter((s) => s.type === 'Common')
    .map((s) => s.data.shares?.value ?? 0)
    .reduce(plus, 0)

  const preferredShares = shareholders
    .filter((s) => s.type === 'Preferred')
    .map((s) => s.data.shares?.value ?? 0)
    .reduce(plus, 0)

  const optionShares = shareholders
    .filter((s) => s.type === 'Option')
    .map((s) => s.data.shares?.value ?? 0)
    .reduce(plus, 0)

  const optionPool = 2000000

  return {
    optionPool,
    authorizedShares: 15000000,
    commonShares,
    optionShares,
    optionRemaining: optionPool - optionShares,
    preferredShares,
    fullyDiluted: commonShares + preferredShares + optionPool,
    totalShares,
    totalFunding,
  }
}
