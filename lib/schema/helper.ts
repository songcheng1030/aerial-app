import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'

/**
 * Because Google saves all Dates as their own Timestamp, we need to coerce them back to Date
 */
export const ZFirestoreDate = z.preprocess((arg) => {
  if (arg instanceof Date) {
    return arg
  }
  return (arg as Timestamp).toDate()
}, z.date())
