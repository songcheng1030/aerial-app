export interface OptionPlan {
  startDate: Date
  endDate?: Date
  poolSize: number
}

export interface Fundraising {
  fundraisingRound: string
  sharePrice: number
  startDate: Date
  shares: number
}

export interface EquityType {
  name: string
  email?: string
  optionPlan?: OptionPlan
}

export const equityType: EquityType[] = [
  {
    name: 'Margaret Hamilton',
    optionPlan: {
      startDate: new Date('2020-01-06T00:00:00'),
      poolSize: 500,
    },
  },
]

export const fundraisingList: Fundraising[] = [
  {
    fundraisingRound: 'Seed Round',
    sharePrice: 100,
    startDate: new Date('2020-01-06T00:00:00'),
    shares: 100,
  },
]
