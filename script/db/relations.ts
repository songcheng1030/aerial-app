import { mkDoc, mkDocGroup, oneYear, oneYears } from '../../lib/state/helper'

export const stateRelations = [
  {
    state: 'Washington',
    startDate: new Date(2021, 0, 1),
    license: [
      ...mkDocGroup(
        {
          type: 'BUSINESS_LICENSE',
          ...oneYear(new Date(2022, 0, 1)),
        },
        oneYears(new Date(2021, 0, 1), new Date(2020, 0, 1))
      ),
    ],
    agent: [
      ...mkDocGroup(
        {
          type: 'REGISTERED_AGENT',
          party: { name: 'Evergreen Registered Agents' },
          ...oneYear(new Date(2022, 0, 1)),
        },
        oneYears(new Date(2021, 0, 1), new Date(2020, 0, 1))
      ),
    ],
    tax: [
      mkDoc({
        type: 'TAX_ID_DOCUMENT',
        startDate: new Date(2020, 0, 1),
        properties: [{ key: 'Washington UBI Number', value: '123456789' }],
      }),
    ],
  },
  {
    state: 'California',
    startDate: new Date(2021, 0, 1),
    license: [
      ...mkDocGroup(
        {
          type: 'BUSINESS_LICENSE',
          party: { name: 'California' },
          ...oneYear(new Date(2022, 0, 1)),
        },
        oneYears(new Date(2021, 0, 1))
      ),
    ],
    agent: [
      ...mkDocGroup(
        {
          type: 'REGISTERED_AGENT',
          party: { name: 'California Registered Agents' },
          ...oneYear(new Date(2022, 0, 1)),
        },
        oneYears(new Date(2021, 0, 1))
      ),
    ],
    tax: [
      mkDoc({
        type: 'TAX_ID_DOCUMENT',
        startDate: new Date(2020, 0, 1),
        properties: [{ key: 'California SEIN', value: '123456789' }],
      }),
    ],
  },
  {
    state: 'Delaware',
    startDate: new Date(2021, 0, 1),
    license: [
      ...mkDocGroup(
        {
          type: 'BUSINESS_LICENSE',
          ...oneYear(new Date(2021, 0, 1)),
        },
        oneYears(new Date(2020, 0, 1))
      ),
    ],
    agent: [
      ...mkDocGroup(
        {
          type: 'REGISTERED_AGENT',
          party: { name: 'Corporation Service Company' },
          ...oneYear(new Date(2022, 0, 1)),
        },
        oneYears(new Date(2021, 0, 1), new Date(2020, 0, 1))
      ),
    ],
  },
]

export const localRelations = [
  {
    jurisdiction: 'Seattle',
    startDate: new Date(2021, 0, 1),
    license: mkDocGroup(
      {
        type: 'BUSINESS_LICENSE',
        ...oneYear(new Date(2022, 0, 1)),
      },
      oneYears(new Date(2021, 0, 1), new Date(2020, 0, 1))
    ),
  },
]
