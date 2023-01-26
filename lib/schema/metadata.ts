import { getDoc } from 'firebase/firestore'
import { z } from 'zod'
import { formattedNumber } from '../util'
import { ZDocRef } from './docs'
import { ZFirestoreDate } from './helper'

/**
 * Metadata
 */
export const mkMetadata = <T extends z.ZodTypeAny>(
  value: T,
  stringify: (_: z.infer<T>) => string
) => {
  return z.union([
    z
      .object({
        value,
        type: z.literal('computed'),
      })
      .transform((obj) => ({ ...obj, string: stringify((obj as any).value) })),
    z
      .object({
        value,
        type: z.literal('edited'),
      })
      .transform((obj) => ({ ...obj, string: stringify((obj as any).value) })),
    z
      .object({
        value,
        type: z.literal('document'),
        sourceRef: ZDocRef,
      })
      .transform(async (obj) => {
        return {
          ...obj,
          source: await (await getDoc(obj.sourceRef)).data(),
          string: stringify((obj as any).value),
        }
      }),
  ])
}

export const MetadataDate = mkMetadata(ZFirestoreDate, (date: Date) => date.toLocaleDateString())
export type MetadataDate = z.infer<typeof MetadataDate>

export const MetadataNumber = mkMetadata(z.number(), (x: number) => x.toLocaleString())
export type MetadataNumber = z.infer<typeof MetadataNumber>

export const MetadataPrice = mkMetadata(z.number(), (x: number) => `$${formattedNumber(x, 2)}`)
export type MetadataPrice = z.infer<typeof MetadataPrice>

export type Metadata = MetadataDate | MetadataNumber | MetadataPrice
