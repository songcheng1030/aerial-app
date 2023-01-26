import { Random } from '../random'

export interface Employee {
  startDate: Date
  endDate?: Date
  annualSalary: number
  noAssignment?: boolean
}

export interface Equity {
  type: 'SAFE' | 'Option' | 'Common' | 'Preferred'
  shares?: number
  date: Date
  price?: number
  noResolution?: boolean
  no83b?: boolean
}

export type PermissionLevel = 'None' | 'Read' | 'Edit'

export type Permission =
  | {
      type: 'admin'
    }
  | {
      type: 'dataroom'
    }
  | {
      type: 'user'
      corporate: PermissionLevel
      personnel: PermissionLevel
      equity: PermissionLevel
      customer: PermissionLevel
    }

export interface OfficerDirector {
  startDate: Date
  endDate?: Date
  noResolution?: boolean
}

export interface Share {
  lastUsed: string
  permission: Permission
}

export interface Contractor {
  startDate: Date
  endDate?: Date
}

export interface Advisor {
  startDate: Date
  endDate?: Date
  noResolution?: boolean
}

export interface People {
  id: string
  name: string
  email: string
  equity?: Equity
  photo: string
  employee?: Employee
  share?: Share
  director?: OfficerDirector
  officer?: OfficerDirector
  contractor?: Contractor
  advisor?: Advisor
}

const random = new Random(4)

export const people: People[] = [
  {
    name: 'Margaret Hamilton',
    photo: 'https://randomuser.me/api/portraits/med/women/22.jpg',
    employee: {
      startDate: new Date('2020-01-01T00:00:00'),
      annualSalary: 150000,
    },
    equity: {
      type: 'Common' as const,
      shares: 5000000,
      price: 500,
      date: new Date('2020-01-06T00:00:00'),
    },
    share: {
      lastUsed: 'Now',
      permission: {
        type: 'admin' as const,
      },
    },
    director: {
      startDate: new Date('2020-01-01T00:00:00'),
      noResolution: true,
    },
    officer: {
      startDate: new Date('2020-01-01T00:00:00'),
    },
  },
  {
    name: 'John von Neuman',
    photo: 'https://randomuser.me/api/portraits/med/men/12.jpg',
    employee: {
      startDate: new Date('2020-01-01T00:00:00'),
      annualSalary: 150000,
    },
    equity: {
      type: 'Common' as const,
      shares: 5000000,
      noResolution: true,
      price: 400,
      no83b: true,
      date: new Date('2020-01-06T00:00:00'),
    },
    share: {
      lastUsed: 'Never',
      permission: {
        type: 'admin' as const,
      },
    },
    director: {
      startDate: new Date('2020-01-01T00:00:00'),
      endDate: new Date('2022-01-01T00:00:00'),
    },
    officer: {
      startDate: new Date('2020-01-01T00:00:00'),
    },
  },
  // Employees
  {
    name: 'Ada Lovelace',
    photo: 'https://randomuser.me/api/portraits/med/women/32.jpg',
    employee: {
      startDate: new Date('2020-05-17T00:00:00'),
      annualSalary: 100000,
    },
    equity: {
      type: 'Option' as const,
      shares: 5000,
      date: new Date('2020-05-17T00:00:00'),
    },
    share: {
      lastUsed: '4 days ago',
      permission: {
        type: 'user',
        corporate: 'Read',
        personnel: 'None',
        equity: 'None',
        customer: 'Edit',
      },
    } as const,
    officer: {
      startDate: new Date('2021-05-17T00:00:00'),
      noResolution: true,
    },
  },
  {
    name: 'Grace Hopper',
    photo: 'https://randomuser.me/api/portraits/med/women/42.jpg',
    employee: {
      startDate: new Date('2020-06-17T00:00:00'),
      annualSalary: 120000,
      noAssignment: true,
    },
    equity: {
      type: 'Option' as const,
      shares: 5000,
      date: new Date('2020-06-17T00:00:00'),
    },
  },
  // Angel Investors
  {
    name: 'Alan Turing',
    photo: 'https://randomuser.me/api/portraits/med/men/2.jpg',
    equity: {
      type: 'SAFE' as const,
      date: new Date('2021-02-02T00:00:00'),
      price: 20000,
    },
    advisor: {
      startDate: new Date('2021-02-02T00:00:00'),
    },
  },
  {
    name: 'Brian Kerninghan',
    photo: 'https://randomuser.me/api/portraits/med/men/5.jpg',
    equity: {
      type: 'SAFE' as const,
      date: new Date('2021-03-02T00:00:00'),
      price: 20000,
    },
    advisor: {
      startDate: new Date('2021-03-02T00:00:00'),
    },
  },
  {
    name: 'Frances Allen',
    photo: 'https://randomuser.me/api/portraits/med/women/2.jpg',
    equity: {
      type: 'SAFE' as const,
      date: new Date('2021-03-05T00:00:00'),
      price: 40000,
    },
    share: {
      lastUsed: '2 weeks ago',
      permission: {
        type: 'dataroom',
      },
    } as const,
    advisor: {
      startDate: new Date('2020-03-05T00:00:00'),
    },
  },
  {
    name: 'Anita Borg',
    photo: 'https://randomuser.me/api/portraits/med/women/12.jpg',
    contractor: {
      startDate: new Date('2020-08-12T00:00:00'),
      endDate: new Date('2021-06-16T00:00:00'),
    },
    employee: {
      startDate: new Date('2021-06-17T00:00:00'),
      annualSalary: 120000,
    },
    equity: {
      type: 'Option' as const,
      shares: 5000,
      date: new Date('2020-08-12T00:00:00'),
    },
  },
  {
    name: 'Katherine Johnson',
    photo: 'https://randomuser.me/api/portraits/med/women/13.jpg',
    contractor: {
      startDate: new Date('2020-09-22T00:00:00'),
    },
    equity: {
      type: 'Option' as const,
      shares: 5000,
      date: new Date('2020-09-22T00:00:00'),
    },
  },
  {
    name: 'Union Square Ventures',
    photo: '/logo/usv.jpeg',
    email: 'fund@usv.com',
    equity: {
      shares: 1250000,
      type: 'Preferred' as const,
      date: new Date('2020-03-08T00:00:00'),
      price: 1500000,
      noResolution: true,
    },
  },
  {
    name: 'Fred Wilson',
    photo: 'https://randomuser.me/api/portraits/med/men/21.jpg',
    email: 'fred.wilson@usv.com',
    director: {
      startDate: new Date('2020-03-08T00:00:00'),
    },
  },
  {
    name: 'Andreessen Horowitz',
    photo: '/logo/a16z.png',
    email: 'marc.andreessen@a16z.com',
    equity: {
      shares: 1250000,
      type: 'Preferred' as const,
      date: new Date('2020-03-08T00:00:00'),
      price: 1500000,
      noResolution: true,
    },
  },
].map(({ ...data }) => ({
  ...data,
  id: random.randomString(20),
  email:
    data.email ??
    data.name.replaceAll(' ', '.').toLowerCase() + (data.employee ? '@seedinc.com' : '@gmail.com'),
}))

export const personByName = Object.fromEntries(people.map((person) => [person.name, person]))

const plus = (x: number, y: number) => x + y

export const equityData = (() => {
  const totalShares = people.map((s) => s.equity?.shares ?? 0).reduce(plus)

  const totalFunding = people.map((s) => s.equity?.price ?? 0).reduce(plus)

  const commonShares = people
    .filter((s) => s.equity?.type === 'Common')
    .map((s) => s.equity?.shares ?? 0)
    .reduce(plus)

  const preferredShares = people
    .filter((s) => s.equity?.type === 'Preferred')
    .map((s) => s.equity?.shares ?? 0)
    .reduce(plus)

  const optionShares = people
    .filter((s) => s.equity?.type === 'Option')
    .map((s) => s.equity?.shares ?? 0)
    .reduce(plus)

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
})()
