import { DocumentReference } from 'firebase/firestore'
import { z } from 'zod'
import { ZFirestoreDate } from './helper'
import { Party } from './party'

import { contentfulDocTypeMap, contentlessDocTypeMap } from './typeMap'

namespace helpers {
  export const mapToEnum = <K extends string>(map: Record<K, unknown>): z.ZodEnum<[K, ...K[]]> =>
    z.enum<K, [K, ...K[]]>(Object.keys(map) as [K, ...K[]])
}

/**
 * Contentful Doc Type
 */
export const ZContentfulDoc = Object.assign(
  z.object({
    type: helpers.mapToEnum(contentfulDocTypeMap),
    party: Party.optional(),
    startDate: ZFirestoreDate,
    endDate: ZFirestoreDate.optional(),
    group: z.string().optional(),
    properties: z.object({ key: z.string(), value: z.string() }).array().optional(),
  }),
  { type: helpers.mapToEnum(contentfulDocTypeMap).options }
)
export type ZContentfulDoc = z.infer<typeof ZContentfulDoc>

/**
 * Contentless Doc Type
 */
export const ZContentlessDoc = Object.assign(
  z.object({
    type: helpers.mapToEnum(contentlessDocTypeMap),
  }),
  { type: helpers.mapToEnum(contentlessDocTypeMap).options }
)
export type ZContentlessDoc = z.infer<typeof ZContentlessDoc>

/**
 * General Doc Type
 */
export const ZDoc = Object.assign(z.union([ZContentfulDoc, ZContentlessDoc]), {
  type: [...ZContentfulDoc.type, ...ZContentlessDoc.type],
})
export type ZDoc = z.infer<typeof ZDoc>

export type DocType<Z extends z.ZodType<any, any, any>> = z.infer<Z>['type']

export const ZDocRef = z.custom<DocumentReference<ZDoc>>(
  (data) => data instanceof DocumentReference,
  {
    message: `Input not instance of ${DocumentReference.name}`,
  },
  true
)
