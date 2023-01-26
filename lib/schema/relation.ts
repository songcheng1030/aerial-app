import DataLoader from 'dataloader'
import { doc, DocumentReference, getDoc } from 'firebase/firestore'
import { z } from 'zod'
import { db } from '../firebase'
import { addOneYear } from '../util'
import { ZContentfulDoc, ZDoc, ZDocRef } from './docs'
import { MetadataDate, MetadataNumber, MetadataPrice } from './metadata'
import { Party } from './party'

export const Status = z.enum(['Current', 'Outdated', 'Inactive', 'Incomplete'])
export type Status = z.infer<typeof Status>

const ZRelationBase = z.object({
  docRefs: ZDocRef.array(),
})
type ZRelationBase = z.infer<typeof ZRelationBase>

export const State = z.enum(['Delaware', 'California', 'Washington'])
export type State = z.infer<typeof State>

type RelationEnricherObj = {
  docRefs: DocumentReference<ZDoc>[]
  startDate?: MetadataDate
  endDate?: MetadataDate
}

export const ZMissingDoc = z.object({
  type: z.literal('MISSING'),
  docType: z.enum(ZContentfulDoc.type),
})
export type ZMissingDoc = z.infer<typeof ZMissingDoc>

export const ZContentfulMissingDoc = z.union([ZMissingDoc, ZContentfulDoc])
export type ZContentfulMissingDoc = z.infer<typeof ZContentfulMissingDoc>

// Helper functions
namespace util {
  const docBatchLoader = async (paths: readonly string[]): Promise<(ZDoc | undefined)[]> => {
    const refs = paths.map((path) => doc(db, path) as DocumentReference<z.input<typeof ZDoc>>)
    const unparsedDocs = await Promise.all(
      refs.map((ref) => getDoc(ref).then((snap) => snap.data()))
    )
    return unparsedDocs.map((d) => (d ? ZDoc.parse(d) : d))
  }

  export const docLoader = new DataLoader(docBatchLoader)

  const loadDocs = (refs: DocumentReference[]) =>
    Promise.all(refs.map((ref) => docLoader.load(ref.path)))

  type DocMap<TypeMap extends Record<string, ZContentfulDoc['type']>> = {
    [key in keyof TypeMap]: ZContentfulMissingDoc
  }

  export class RelationEnricher<TypeMap extends Record<string, ZContentfulDoc['type']>> {
    _docs: (ZDoc | undefined)[] | null = null
    public docRefs: DocumentReference<ZDoc>[]
    public startDate?: MetadataDate
    public endDate?: MetadataDate

    constructor(
      { docRefs, startDate, endDate }: RelationEnricherObj,
      public docTypeMap: TypeMap,
      public now: Date = new Date()
    ) {
      this.docRefs = docRefs
      this.startDate = startDate
      this.endDate = endDate
    }

    async parseAync() {
      this._docs = await loadDocs(this.docRefs)
      return this
    }

    get docs(): (ZDoc | undefined)[] {
      if (!this._docs) throw Error('Must call parseAsync first')
      return this._docs
    }

    findDoc(type: ZContentfulDoc['type']): ZContentfulMissingDoc {
      return (
        this.docs.find((d): d is ZContentfulDoc => d?.type === type) ?? {
          type: 'MISSING',
          docType: type,
        }
      )
    }

    docMap(): DocMap<TypeMap> {
      return Object.fromEntries(
        Object.entries(this.docTypeMap).map(([key, type]) => [key, this.findDoc(type)])
      ) as DocMap<TypeMap>
    }

    isComplete(docMap?: DocMap<TypeMap>): boolean {
      return Object.values(docMap ?? this.docMap()).every((x) => x.type !== 'MISSING')
    }

    /**
     * Either no start date or start date in past *and*
     * EIther no end date or end date in future
     * @returns
     */
    isCurrent(): boolean {
      return (
        (!this.startDate || this.startDate.value <= this.now) &&
        (!this.endDate || this.endDate.value > this.now)
      )
    }

    status(isComplete?: boolean): Status {
      return !(isComplete ?? this.isComplete())
        ? 'Incomplete'
        : this.isCurrent()
        ? 'Current'
        : 'Outdated'
    }

    /**
     * @returns data to enrich
     */
    output() {
      // trying to make this more optimized
      const docMap = this.docMap()
      const isComplete = this.isComplete(docMap)
      return {
        docs: this.docs,
        isCurrent: this.isCurrent(),
        isComplete,
        // Cast status to force it from type string
        status: this.status(isComplete) as Status,
        ...docMap,
      }
    }
  }
}

/**
 * State Corporation
 */
export const ZStateCorporation = ZRelationBase.merge(
  z.object({
    state: State,
    startDate: MetadataDate.optional(),
    endDate: MetadataDate.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    license: 'BUSINESS_LICENSE', // Primary Document
    agent: 'REGISTERED_AGENT',
    taxId: 'TAX_ID_DOCUMENT',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZStateCorporation = z.infer<typeof ZStateCorporation>

/**
 * Local Corporation
 */
export const ZLocalCorporation = ZRelationBase.merge(
  z.object({
    jurisdiction: z.string(),
    startDate: MetadataDate.optional(),
    endDate: MetadataDate.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    license: 'BUSINESS_LICENSE', // Primary Document
    agent: 'REGISTERED_AGENT',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZLocalCorporation = z.infer<typeof ZLocalCorporation>

/**
 * Employee
 */
export const ZEmployee = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    endDate: MetadataDate.optional(),
    salary: MetadataPrice.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    offer: 'OFFER_LETTER', // Primary Document
    employment: 'EMPLOYMENT_AGREEMENT',
    assignment: 'PROPRIETARY_INFORMATION_AND_INVENTION_ASSIGNMENT',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZEmployee = z.infer<typeof ZEmployee>

/**
 * Officer
 */
export const ZOfficer = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    endDate: MetadataDate.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    consent: 'BOARD_CONSENT_AND_MINUTES', // Primary Document
    indemnification: 'INDEMNIFICATION_AGREEMENT',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZOfficer = z.infer<typeof ZOfficer>

/**
 * Director
 */
export const ZDirector = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    endDate: MetadataDate.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    consent: 'STOCKHOLDER_CONSENT', // Primary Document
    indemnification: 'INDEMNIFICATION_AGREEMENT',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZDirector = z.infer<typeof ZDirector>

/**
 * Advisor
 */
export const ZAdvisor = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    endDate: MetadataDate.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    agreement: 'ADVISOR_AGREEMENT', // Primary Document
    consent: 'BOARD_CONSENT_AND_MINUTES',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZAdvisor = z.infer<typeof ZAdvisor>

/**
 * Contractor
 */
export const ZContractor = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    endDate: MetadataDate.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    agreement: 'CONTRACTOR_AGREEMENT', // Primary Document
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZContractor = z.infer<typeof ZContractor>

/**
 * Common Stock
 */
export const ZCommon = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    shares: MetadataNumber.optional(),
    investment: MetadataPrice.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    purchase: 'COMMON_STOCK_PURCHASE_AGREEMENT', // Primary Document
    _83b: 'SECTION_83B_ELECTION_FORM',
    consent: 'BOARD_CONSENT_AND_MINUTES',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZCommon = z.infer<typeof ZCommon>

/**
 * Stock Option
 */
export const ZOption = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    shares: MetadataNumber.optional(),
    // TODO: stock option plan
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    grant: 'STOCK_OPTION_GRANT', // Primary Document
    consent: 'BOARD_CONSENT_AND_MINUTES',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZOption = z.infer<typeof ZOption>

/**
 * SAFE
 */
export const ZSafe = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    investment: MetadataPrice.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    grant: 'SIMPLE_AGREEMENT_FOR_FUTURE_EQUITY', // Primary Document
    consent: 'BOARD_CONSENT_AND_MINUTES',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZSafe = z.infer<typeof ZSafe>

/**
 * Preferred Stock
 */
export const ZPreferred = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    shares: MetadataNumber.optional(),
    investment: MetadataPrice.optional(),
    // TODO: funding round
  })
)
export type ZPreferred = z.infer<typeof ZPreferred>

/**
 * Valuation
 */
export const ZOptionPlan = ZRelationBase.merge(
  z.object({
    party: Party.optional(),
    startDate: MetadataDate.optional(),
    endDate: MetadataDate.optional(),
    poolSize: MetadataNumber.optional(), // The current aggregate size of option pool
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    plan: 'STOCK_OPTION_PLAN', // Primary Document
    boardConsent: 'BOARD_CONSENT_AND_MINUTES',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZOptionPlan = z.infer<typeof ZOptionPlan>

/**
 * Valuation
 */
export const ZFundraising = ZRelationBase.merge(
  z.object({
    fundraisingRound: z.string(),
    sharePrice: MetadataPrice.optional(),
    startDate: MetadataDate.optional(),
    shares: MetadataNumber.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    voting: 'VOTING_AGREEMENT', // Primary Document
    refulsal: 'RIGHT_OF_FIRST_REFUSAL_AND_COSALE_AGREEMENT',
    legal: 'LEGAL_OPINION',
    investor: 'INVESTOR_RIGHTS_AGREEMENT',
    consent: 'BOARD_CONSENT_AND_MINUTES',
    stockholder: 'STOCKHOLDER_CONSENT',
    securities: 'SECURITIES_LAW_FILING',
    side: 'SIDE_LETTER',
    articles: 'ARTICLES_OF_INCORPORATION',
    forma: 'PRO_FORMA_CAP_TABLE',
    preferred: 'PREFERRED_STOCK_PURCHASE_AGREEMENT',
  }).parseAync()

  return {
    ...obj,
    ...enricher.output(),
  }
})
export type ZFundraising = z.infer<typeof ZFundraising>

/**
 * Valuation
 */
export const ZValuation = ZRelationBase.merge(
  z.object({
    valuation: MetadataPrice.optional(), // consider changing to sharePrice
    startDate: MetadataDate.optional(),
  })
).transform(async (obj) => {
  const enricher = await new util.RelationEnricher(obj, {
    _409a: '_409A_REPORT', // Primary Document
    boardConsent: 'BOARD_CONSENT_AND_MINUTES',
  }).parseAync()

  const endDate: MetadataDate | undefined = obj.startDate
    ? MetadataDate.parse({
        value: addOneYear(obj.startDate.value),
        type: 'computed',
      })
    : undefined

  return {
    ...obj,
    ...enricher.output(),
    endDate,
  }
})
export type ZValuation = z.infer<typeof ZValuation>
