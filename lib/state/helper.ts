import { Random } from '../random'
import { ZContentfulDoc } from '../schema'
import { addOneYear } from '../util'

export const random = new Random(5)

export const mkDoc = <T extends ZContentfulDoc>(doc: T): T => ZContentfulDoc.parse(doc) as T
export const mkDocGroup = <T extends ZContentfulDoc>(doc: T, priorDocs: Partial<T>[] = []): T[] => {
  const group = random.randomString(20)
  return [
    mkDoc({ group, ...doc }),
    ...priorDocs.map((priorDoc) => mkDoc({ ...doc, ...priorDoc, group })),
  ]
}
export const oneYear = (startDate: Date) => ({
  startDate,
  endDate: addOneYear(startDate),
})
export const oneYears = (...startDates: Date[]) => startDates.map((startDate) => oneYear(startDate))
