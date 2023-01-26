import { z } from 'zod'
import { cruds } from '../lib/crud'
import { mkBatch } from '../lib/firebase'
import {
  MetadataDate,
  MetadataNumber,
  MetadataPrice,
  State,
  ZAdvisor,
  ZCommon,
  ZContentfulDoc,
  ZContractor,
  ZDirector,
  ZEmployee,
  ZFundraising,
  ZOfficer,
  ZOption,
  ZOptionPlan,
  ZPreferred,
  ZSafe,
} from '../lib/schema'
import { addOneYear } from '../lib/util'
import { equityType, EquityType, Fundraising, fundraisingList, OptionPlan } from './db/equity'
import { Contractor, Employee, Equity, OfficerDirector, People, people } from './db/people'
import { localRelations, stateRelations } from './db/relations'

const mkZod = <T>(x: T) => x

export const oneYear = (startDate: Date) => ({
  startDate,
  endDate: addOneYear(startDate),
})

namespace helpers {
  const mkDoc = (x: ZContentfulDoc) => mkZod<ZContentfulDoc>(x)

  const getEmail = (name: string, email: string | undefined = undefined) =>
    email ?? `${name.replaceAll(' ', '.').toLowerCase()}@gmail.com`

  export const addEmployeeDoc = async ({
    startDate,
    salary,
    email,
    name,
    noAssignment,
  }: People & Employee) => {
    const party = { name, email: getEmail(name, email) }

    const [offerRef, employRef, assignRef] = [cruds.doc.doc(), cruds.doc.doc(), cruds.doc.doc()]

    const batch = mkBatch()
    batch.set(offerRef, mkDoc({ type: 'OFFER_LETTER', startDate, party }))
    batch.set(employRef, mkDoc({ type: 'EMPLOYMENT_AGREEMENT', startDate, party }))
    if (!noAssignment) {
      batch.set(
        assignRef,
        mkDoc({
          party,
          type: 'PROPRIETARY_INFORMATION_AND_INVENTION_ASSIGNMENT',
          startDate,
        })
      )
    }

    await batch.commit()

    return cruds.employee.add(
      mkZod<z.input<typeof ZEmployee>>({
        party,
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: startDate,
          type: 'document',
          sourceRef: offerRef,
        }),
        salary: mkZod<z.input<typeof MetadataPrice>>({
          value: salary,
          type: 'document',
          sourceRef: offerRef,
        }),
        docRefs: [offerRef, employRef].concat(noAssignment ? [] : [assignRef]),
      })
    )
  }

  export const addOfficer = async ({
    startDate,
    email,
    name,
    noResolution,
  }: People & OfficerDirector) => {
    const party = { name, email: getEmail(name, email) }

    const [consentRef, indemnificationRef] = [cruds.doc.doc(), cruds.doc.doc()]

    const batch = mkBatch()

    if (!noResolution) {
      batch.set(
        consentRef,
        mkDoc({
          party,
          type: 'BOARD_CONSENT_AND_MINUTES',
          startDate,
        })
      )
    }
    batch.set(indemnificationRef, mkDoc({ type: 'INDEMNIFICATION_AGREEMENT', startDate, party }))

    await batch.commit()

    return cruds.officer.add(
      mkZod<z.input<typeof ZOfficer>>({
        party,
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: startDate,
          type: 'document',
          sourceRef: consentRef,
        }),
        docRefs: [indemnificationRef].concat(noResolution ? [] : [consentRef]),
      })
    )
  }

  export const addDirector = async ({
    startDate,
    email,
    name,
    noResolution,
  }: People & OfficerDirector) => {
    const party = { name, email: getEmail(name, email) }

    const [consentRef, indemnificationRef] = [cruds.doc.doc(), cruds.doc.doc()]

    const batch = mkBatch()

    if (!noResolution) {
      batch.set(
        consentRef,
        mkDoc({
          party,
          type: 'STOCKHOLDER_CONSENT',
          startDate,
        })
      )
    }
    batch.set(indemnificationRef, mkDoc({ type: 'INDEMNIFICATION_AGREEMENT', startDate, party }))

    await batch.commit()

    return cruds.director.add(
      mkZod<z.input<typeof ZDirector>>({
        party,
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: startDate,
          type: 'document',
          sourceRef: consentRef,
        }),
        docRefs: [indemnificationRef].concat(noResolution ? [] : [consentRef]),
      })
    )
  }

  export const addAdvisor = async ({
    startDate,
    email,
    name,
    noResolution,
  }: People & OfficerDirector) => {
    const party = { name, email: getEmail(name, email) }

    const [consentRef, agreementRef] = [cruds.doc.doc(), cruds.doc.doc()]

    const batch = mkBatch()

    if (!noResolution) {
      batch.set(
        consentRef,
        mkDoc({
          party,
          type: 'BOARD_CONSENT_AND_MINUTES',
          startDate,
        })
      )
    }
    batch.set(agreementRef, mkDoc({ type: 'ADVISOR_AGREEMENT', startDate, party }))

    await batch.commit()

    return cruds.advisor.add(
      mkZod<z.input<typeof ZAdvisor>>({
        party,
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: startDate,
          type: 'document',
          sourceRef: consentRef,
        }),
        docRefs: [agreementRef].concat(noResolution ? [] : [consentRef]),
      })
    )
  }

  export const addContractor = async ({ startDate, email, name, endDate }: People & Contractor) => {
    const party = { name, email: getEmail(name, email) }

    const [agreementRef] = [cruds.doc.doc()]

    const batch = mkBatch()
    batch.set(agreementRef, mkDoc({ type: 'CONTRACTOR_AGREEMENT', startDate, party }))
    await batch.commit()

    return cruds.contractor.add(
      mkZod<z.input<typeof ZContractor>>({
        party,
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: startDate,
          type: 'document',
          sourceRef: agreementRef,
        }),
        endDate: endDate
          ? mkZod<z.input<typeof MetadataDate>>({
              value: endDate,
              type: 'document',
              sourceRef: agreementRef,
            })
          : undefined,
        docRefs: [agreementRef],
      })
    )
  }

  export const addValuation = async (startDate: Date, valuation: number) => {
    const [reportRef, consentRef] = await Promise.all([
      cruds.doc.add(
        mkDoc({
          type: '_409A_REPORT',
          party: { name: 'Oxford Valuations' },
          ...oneYear(startDate),
        })
      ),
      cruds.doc.add(
        mkDoc({
          type: 'BOARD_CONSENT_AND_MINUTES',
          startDate,
        })
      ),
    ])

    return cruds.valuation.add({
      docRefs: [reportRef, consentRef],
      valuation: { type: 'document', value: valuation, sourceRef: reportRef },
      startDate: { type: 'document', value: startDate, sourceRef: reportRef },
    })
  }

  export const addStateRelation = async (
    state: State,
    startDate: Date,
    license: ZContentfulDoc[],
    agent: ZContentfulDoc[],
    tax?: ZContentfulDoc[]
  ) => {
    const licenceRefs = await Promise.all(license.map((doc) => cruds.doc.add(doc)))
    const agentRefs = await Promise.all(agent.map((doc) => cruds.doc.add(doc)))
    const taxRefs = await Promise.all((tax ?? []).map((doc) => cruds.doc.add(doc)))

    return cruds.state.add({
      state,
      startDate: { type: 'document', value: startDate, sourceRef: licenceRefs[0] },
      docRefs: [...licenceRefs, ...agentRefs, ...taxRefs],
    })
  }

  export const addLocalRelation = async (
    jurisdiction: string,
    startDate: Date,
    license: ZContentfulDoc[]
  ) => {
    const licenceRefs = await Promise.all(license.map((doc) => cruds.doc.add(doc)))

    return cruds.local.add({
      jurisdiction,
      startDate: { type: 'document', value: startDate, sourceRef: licenceRefs[0] },
      docRefs: [...licenceRefs],
    })
  }

  export const addSafeEquity = async ({ date, email, name, price }: People & Equity) => {
    const party = { name, email: getEmail(name, email) }

    const [consentRef, grantRef] = [cruds.doc.doc(), cruds.doc.doc()]

    const batch = mkBatch()

    batch.set(
      consentRef,
      mkDoc({
        party,
        type: 'BOARD_CONSENT_AND_MINUTES',
        startDate: date,
      })
    )

    batch.set(
      grantRef,
      mkDoc({ type: 'SIMPLE_AGREEMENT_FOR_FUTURE_EQUITY', startDate: date, party })
    )

    await batch.commit()

    return cruds.safe.add(
      mkZod<z.input<typeof ZSafe>>({
        party,
        investment: mkZod<z.input<typeof MetadataPrice>>({
          value: price!, // every safe equity has a price
          type: 'document',
          sourceRef: grantRef,
        }),
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: date,
          type: 'document',
          sourceRef: grantRef,
        }),
        docRefs: [grantRef, consentRef],
      })
    )
  }

  export const addPreferredEquity = async ({
    date,
    email,
    name,
    price,
    shares,
    noResolution,
  }: People & Equity) => {
    const party = { name, email: getEmail(name, email) }

    const [consentRef, grantRef] = [cruds.doc.doc(), cruds.doc.doc()]

    const batch = mkBatch()

    batch.set(
      grantRef,
      mkDoc({ type: 'SIMPLE_AGREEMENT_FOR_FUTURE_EQUITY', startDate: date, party })
    )

    if (!noResolution)
      batch.set(consentRef, mkDoc({ type: 'BOARD_CONSENT_AND_MINUTES', startDate: date, party }))

    await batch.commit()

    return cruds.preferred.add(
      mkZod<z.input<typeof ZPreferred>>({
        party,
        shares: mkZod<z.input<typeof MetadataNumber>>({
          value: shares!, // every preffered has shares
          type: 'document',
          sourceRef: grantRef,
        }),
        investment: mkZod<z.input<typeof MetadataPrice>>({
          value: price!, // every preffered has a price
          type: 'document',
          sourceRef: grantRef,
        }),
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: date,
          type: 'document',
          sourceRef: grantRef,
        }),
        docRefs: [grantRef].concat(noResolution ? [] : [consentRef]),
      })
    )
  }

  export const addOptionEquity = async ({ date, email, name, shares }: People & Equity) => {
    const party = { name, email: getEmail(name, email) }

    const [consentRef, grantRef] = [cruds.doc.doc(), cruds.doc.doc()]

    const batch = mkBatch()

    batch.set(
      consentRef,
      mkDoc({
        party,
        type: 'BOARD_CONSENT_AND_MINUTES',
        startDate: date,
      })
    )

    batch.set(grantRef, mkDoc({ type: 'STOCK_OPTION_GRANT', startDate: date, party }))

    await batch.commit()

    return cruds.option.add(
      mkZod<z.input<typeof ZOption>>({
        party,
        shares: mkZod<z.input<typeof MetadataNumber>>({
          value: shares!, // every option has shares
          type: 'document',
          sourceRef: grantRef,
        }),
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: date,
          type: 'document',
          sourceRef: grantRef,
        }),
        docRefs: [grantRef, consentRef],
      })
    )
  }

  export const addCommonEquity = async ({
    date,
    email,
    name,
    price,
    shares,
    no83b,
    noResolution,
  }: People & Equity) => {
    const party = { name, email: getEmail(name, email) }

    const [purchaseRef, _83bRef, consentRef] = [cruds.doc.doc(), cruds.doc.doc(), cruds.doc.doc()]

    const batch = mkBatch()

    batch.set(
      purchaseRef,
      mkDoc({ type: 'COMMON_STOCK_PURCHASE_AGREEMENT', startDate: date, party })
    )

    if (!no83b)
      batch.set(_83bRef, mkDoc({ type: 'SECTION_83B_ELECTION_FORM', startDate: date, party }))

    if (!noResolution)
      batch.set(consentRef, mkDoc({ type: 'BOARD_CONSENT_AND_MINUTES', startDate: date, party }))

    await batch.commit()

    return cruds.common.add(
      mkZod<z.input<typeof ZCommon>>({
        party,
        shares: mkZod<z.input<typeof MetadataNumber>>({
          value: shares!, // every preffered has shares
          type: 'document',
          sourceRef: purchaseRef,
        }),
        investment: mkZod<z.input<typeof MetadataPrice>>({
          value: price!, // every preffered has a price
          type: 'document',
          sourceRef: purchaseRef,
        }),
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: date,
          type: 'document',
          sourceRef: purchaseRef,
        }),
        docRefs: [purchaseRef]
          .concat(no83b ? [] : [_83bRef])
          .concat(noResolution ? [] : [consentRef]),
      })
    )
  }

  export const addOtionPlan = async ({
    name,
    email,
    startDate,
    endDate,
    poolSize,
  }: EquityType & OptionPlan) => {
    const party = { name, email: getEmail(name, email) }

    const [planRef, boardConsentRef] = [cruds.doc.doc(), cruds.doc.doc()]

    const batch = mkBatch()

    batch.set(
      boardConsentRef,
      mkDoc({
        party,
        type: 'BOARD_CONSENT_AND_MINUTES',
        startDate,
      })
    )

    batch.set(planRef, mkDoc({ type: 'STOCK_OPTION_PLAN', startDate, party }))

    await batch.commit()

    return cruds.optionPlan.add(
      mkZod<z.input<typeof ZOptionPlan>>({
        party,
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: startDate,
          type: 'document',
          sourceRef: planRef,
        }),
        endDate: endDate
          ? mkZod<z.input<typeof MetadataDate>>({
              value: endDate,
              type: 'document',
              sourceRef: planRef,
            })
          : undefined,
        poolSize: mkZod<z.input<typeof MetadataNumber>>({
          value: poolSize,
          type: 'document',
          sourceRef: planRef,
        }),
        docRefs: [planRef, boardConsentRef],
      })
    )
  }

  export const addFundraising = async ({
    fundraisingRound,
    startDate,
    sharePrice,
    shares,
  }: Fundraising) => {
    const batch = mkBatch()

    const [
      votingRef,
      refulsalRef,
      legalRef,
      investorRef,
      consentRef,
      stockholderRef,
      securitiesRef,
      sideRef,
      articlesRef,
      formaRef,
      preferredRef,
    ] = [
      cruds.doc.doc(),
      cruds.doc.doc(),
      cruds.doc.doc(),
      cruds.doc.doc(),
      cruds.doc.doc(),
      cruds.doc.doc(),
      cruds.doc.doc(),
      cruds.doc.doc(),
      cruds.doc.doc(),
      cruds.doc.doc(),
      cruds.doc.doc(),
    ]

    batch.set(votingRef, mkDoc({ type: 'VOTING_AGREEMENT', startDate }))
    batch.set(
      refulsalRef,
      mkDoc({ type: 'RIGHT_OF_FIRST_REFUSAL_AND_COSALE_AGREEMENT', startDate })
    )
    batch.set(legalRef, mkDoc({ type: 'LEGAL_OPINION', startDate }))
    batch.set(investorRef, mkDoc({ type: 'INVESTOR_RIGHTS_AGREEMENT', startDate }))
    batch.set(consentRef, mkDoc({ type: 'BOARD_CONSENT_AND_MINUTES', startDate }))
    batch.set(stockholderRef, mkDoc({ type: 'STOCKHOLDER_CONSENT', startDate }))
    batch.set(securitiesRef, mkDoc({ type: 'SECURITIES_LAW_FILING', startDate }))
    batch.set(sideRef, mkDoc({ type: 'SIDE_LETTER', startDate }))
    batch.set(articlesRef, mkDoc({ type: 'ARTICLES_OF_INCORPORATION', startDate }))
    batch.set(formaRef, mkDoc({ type: 'PRO_FORMA_CAP_TABLE', startDate }))
    batch.set(preferredRef, mkDoc({ type: 'PREFERRED_STOCK_PURCHASE_AGREEMENT', startDate }))

    await batch.commit()

    return cruds.fundraising.add(
      mkZod<z.input<typeof ZFundraising>>({
        fundraisingRound,
        startDate: mkZod<z.input<typeof MetadataDate>>({
          value: startDate,
          type: 'document',
          sourceRef: votingRef,
        }),
        sharePrice: mkZod<z.input<typeof MetadataNumber>>({
          value: sharePrice,
          type: 'document',
          sourceRef: votingRef,
        }),
        shares: mkZod<z.input<typeof MetadataNumber>>({
          value: shares,
          type: 'document',
          sourceRef: votingRef,
        }),
        docRefs: [
          votingRef,
          refulsalRef,
          legalRef,
          investorRef,
          consentRef,
          stockholderRef,
          securitiesRef,
          sideRef,
          articlesRef,
          formaRef,
          preferredRef,
        ],
      })
    )
  }
}

const main = async () => {
  console.log('Seeding Data ...')

  await Promise.all(
    people
      .flatMap((p) => (!!p.employee ? [{ ...p, ...p.employee }] : []))
      .map(helpers.addEmployeeDoc)
  )

  console.log('Seeded Employees ...')

  await Promise.all(
    people.flatMap((p) => (!!p.officer ? [{ ...p, ...p.officer }] : [])).map(helpers.addOfficer)
  )

  await Promise.all(
    people.flatMap((p) => (!!p.director ? [{ ...p, ...p.director }] : [])).map(helpers.addDirector)
  )

  await Promise.all(
    people.flatMap((p) => (!!p.advisor ? [{ ...p, ...p.advisor }] : [])).map(helpers.addAdvisor)
  )

  await Promise.all(
    people
      .flatMap((p) => (!!p.contractor ? [{ ...p, ...p.contractor }] : []))
      .map(helpers.addContractor)
  )

  await Promise.all(
    equityType
      .flatMap((p) => (!!p.optionPlan ? [{ ...p, ...p.optionPlan }] : []))
      .map(helpers.addOtionPlan)
  )

  console.log('Seeded OptionPlan Data ...')

  await Promise.all(fundraisingList.flatMap((p) => p).map(helpers.addFundraising))

  console.log('Seeded Fundraising Data ...')

  await Promise.all(
    people
      .flatMap((p) => (!!p.equity ? [{ ...p, ...p.equity }] : []))
      .map((equity) => {
        switch (equity.type) {
          case 'SAFE':
            return helpers.addSafeEquity(equity)
          case 'Preferred':
            return helpers.addPreferredEquity(equity)
          case 'Option':
            return helpers.addOptionEquity(equity)
          case 'Common':
            return helpers.addCommonEquity(equity)
          default:
            return
        }
      })
  )

  console.log('Seeded Equity Data ...')

  await Promise.all([
    helpers.addValuation(new Date(2022, 0, 1), 1.45),
    helpers.addValuation(new Date(2021, 0, 1), 0.95),
    helpers.addValuation(new Date(2020, 0, 1), 0.25),
  ])
  console.log('Seeded Valuations ...')

  await Promise.all(
    stateRelations.map((relation) =>
      helpers.addStateRelation(
        relation.state as State,
        relation.startDate,
        relation.license,
        relation.agent,
        relation.tax
      )
    )
  )

  console.log('Seeded State Relations ...')

  await Promise.all(
    localRelations.map((relation) =>
      helpers.addLocalRelation(relation.jurisdiction, relation.startDate, relation.license)
    )
  )

  console.log('Seeded Local Relations ...')

  process.exit(0) // Must manually exit
}

if (require.main === module) {
  main()
}
