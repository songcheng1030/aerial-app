import { groupBy, sortBy } from 'underscore'
import { Random } from '../random'
import { DocType, State, ZContentfulDoc, ZContentlessDoc, ZDoc } from '../schema'
import { mkDoc, mkDocGroup, oneYear, oneYears } from './helper'

export const random = new Random(2)

export const primaryDocs = [
  ...mkDocGroup(
    {
      type: 'ARTICLES_OF_INCORPORATION',
      party: { name: 'Delaware' },
      ...oneYear(new Date(2022, 0, 1)),
      properties: [
        { key: 'Corporation Name', value: 'Seed, Inc.' },
        { key: 'Incorporation Date', value: 'Feb 5, 2020' },
      ],
    },
    oneYears(new Date(2021, 0, 1), new Date(2020, 0, 1))
  ),
  ...[new Date(2022, 0, 1), new Date(2021, 5, 1), new Date(2021, 3, 1), new Date(2020, 3, 1)].map(
    (startDate) =>
      mkDoc({
        type: 'BOARD_CONSENT_AND_MINUTES',
        startDate,
      })
  ),
  mkDoc({
    type: 'INCORPORATOR_CONSENT',
    startDate: new Date(2020, 0, 1),
  }),
  mkDoc({
    type: 'STOCKHOLDER_CONSENT',
    startDate: new Date(2021, 0, 1),
  }),
  mkDoc({
    type: 'IRS_EIN_ASSIGNMENT_LETTER',
    party: { name: 'Internal Revenue Service' },
    startDate: new Date(2020, 0, 1),
    properties: [{ key: 'EIN', value: '89-1234567' }],
  }),
]

const otherPrimaryDocs = [
  mkDoc({
    type: 'STOCK_OPTION_PLAN',
    startDate: new Date(2021, 3, 1),
  }),
  // Insurance
  mkDoc({
    type: 'CERTIFICATE_OF_INSURANCE',
    party: { name: 'Cincinnati Insurance' },
    startDate: new Date(2022, 0, 1),
    properties: [{ key: 'Insurance Type', value: 'General Liability' }],
  }),
  mkDoc({
    type: 'CERTIFICATE_OF_INSURANCE',
    party: { name: 'Cincinnati Insurance' },
    startDate: new Date(2022, 0, 1),
    properties: [{ key: 'Insurance Type', value: 'Directors and Officers' }],
  }),
  mkDoc({
    type: 'INSURANCE_AGREEMENT',
    party: { name: 'Cincinnati Insurance' },
    startDate: new Date(2022, 0, 1),
    properties: [{ key: 'Insurance Type', value: 'General Liability' }],
  }),
  mkDoc({
    type: 'INSURANCE_AGREEMENT',
    party: { name: 'Cincinnati Insurance' },
    startDate: new Date(2022, 0, 1),
    properties: [{ key: 'Insurance Type', value: 'Directors and Officers' }],
  }),
]

const contentlessDocs: ZContentlessDoc[] = [
  { type: 'UNCATEGORIZED' },
  { type: 'UNCATEGORIZED' },
  { type: 'UNCATEGORIZED' },
  { type: 'PROCESSING' },
  { type: 'PROCESSING' },
  { type: 'PROCESSING' },
]

const allDocs: ZDoc[] = [...primaryDocs, ...otherPrimaryDocs, ...contentlessDocs]

export type DocState = 'active' | 'inactive' | 'outdated'

type ZDocType = DocType<typeof ZDoc>

export interface DocQuery {
  type?: ZDocType | ZDocType[]
  state?: State | State[]
}

export const Doc = {
  isContentful: (doc: ZDoc): doc is ZContentfulDoc =>
    !(ZContentlessDoc.type as readonly string[]).includes(doc.type),
  isCurrent: (
    { startDate, endDate }: Pick<ZContentfulDoc, 'startDate' | 'endDate'>,
    now = new Date()
  ): boolean => {
    return now >= startDate && (!endDate || now < endDate)
  },
  query: ({ type }: DocQuery): ZDoc[] => {
    const typeFilter: (_: ZDoc) => boolean =
      type === undefined
        ? () => true
        : Array.isArray(type)
        ? (doc) => type.includes(doc.type)
        : (doc) => doc.type === type

    return allDocs.filter(typeFilter)
  },
  docState: (
    { startDate, endDate }: Pick<ZContentfulDoc, 'startDate' | 'endDate'>,
    isLatest: boolean,
    now = new Date()
  ): DocState => {
    const current = Doc.isCurrent({ startDate, endDate }, now)
    return current ? 'active' : isLatest ? 'outdated' : 'inactive'
  },
}

export class DocGroup {
  /**
   * The latest document
   */
  latest: ZDoc
  /**
   * All documents besides the latest, in chronological order by `startDate`
   */
  previous: ZDoc[]
  constructor(docs: [ZContentlessDoc])
  constructor(docs: ZContentfulDoc[])
  constructor(public docs: ZDoc[]) {
    if (docs.length === 1) {
      ;[this.latest] = docs
      this.previous = []
    } else {
      const contentfulDocs = docs as ZContentfulDoc[]
      // Save latest as a separate variable to not forget it's type
      const latest = contentfulDocs.reduce((x, y) =>
        x.startDate.getTime() > y.startDate.getTime() ? x : y
      )
      const previous = contentfulDocs.filter(
        (doc) => doc.startDate.getTime() !== latest.startDate.getTime()
      )
      this.latest = latest
      this.previous = sortBy(previous, (doc) => doc.startDate.getTime())
    }
  }

  get isCurrent(): boolean | undefined {
    if (Doc.isContentful(this.latest)) {
      return Doc.isCurrent(this.latest)
    }
    return undefined
  }
  get isContentful(): boolean {
    return Doc.isContentful(this.latest)
  }

  static toDocGroups(docs: (ZDoc | undefined)[]): DocGroup[] {
    const contentful = docs.filter((doc) => !!doc && Doc.isContentful(doc)) as ZContentfulDoc[]
    const contentless = docs.filter((doc) => !!doc && !Doc.isContentful(doc)) as ZContentlessDoc[]

    const grouped = contentful.filter((doc) => !!doc.group)
    const ungrouped = contentful.filter((doc) => !doc.group)
    const groups = groupBy(grouped, (doc) => doc.group ?? 0)
    return [
      ...Object.values(groups).map((docs_) => new DocGroup(docs_)),
      ...ungrouped.map((doc) => new DocGroup([doc])),
      ...contentless.map((doc) => new DocGroup([doc])),
    ]
  }

  static query(query: DocQuery): DocGroup[] {
    return this.toDocGroups(Doc.query(query))
  }

  static search(query: string): DocGroup[] {
    const results = allDocs.filter((doc) => {
      if (!Doc.isContentful(doc)) return false
      if (doc.type.toLowerCase().includes(query)) return true
      if (doc.party?.name.toLowerCase()?.includes(query)) return true
      return false
    })
    return this.toDocGroups(results)
  }
}
