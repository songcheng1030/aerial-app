import { z } from 'zod'
import { unparse } from './helper'

const Child = z
  .object({
    s: z.string(),
    n: z.number(),
  })
  .transform((arg) => ({ ...arg, t: arg.s }))

const Parent = z.object({
  b: z.boolean(),
  o: Child,
})

const Parent2 = z
  .object({
    b: z.boolean(),
    o: Child,
  })
  .transform((arg) => ({ ...arg, t: arg.b }))

const obj = {
  b: true,
  o: {
    s: 'a',
    n: 2,
  },
}

test('should parse correctly', () => {
  expect(Parent.parse(obj)).toStrictEqual({
    b: true,
    o: {
      s: 'a',
      n: 2,
      t: 'a',
    },
  })
  expect(Parent2.parse(obj)).toStrictEqual({
    b: true,
    o: {
      s: 'a',
      n: 2,
      t: 'a',
    },
    t: true,
  })
})

test('should unparse correctly', () => {
  expect(unparse(Parent)(Parent.parse(obj))).toStrictEqual(obj)
  expect(unparse(Parent)(Parent2.parse(obj))).toStrictEqual(obj)
  expect(unparse(Parent2)(Parent.parse(obj))).toStrictEqual(obj)
  expect(unparse(Parent2)(Parent2.parse(obj))).toStrictEqual(obj)
})
