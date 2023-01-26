/* eslint-disable no-else-return */
import { z } from 'zod'

/**
 * This takes a zod schema and recursively removes `transform`-type `ZodEffects`, returning
 * the result.  Other types of ZoeEffects are left unchanged (e.g. `preprocessing`).
 * For more, see https://github.com/colinhacks/zod
 * Modelled on Zod's `deepPartialify`
 * @param schema input schema
 */
export function deepRemoveTransform<
  Output = any,
  Def extends z.ZodTypeDef = z.ZodTypeDef,
  Input = Output
>(schema: z.ZodType<Output, Def, Input>): z.ZodType<Input, Def, Input>
export function deepRemoveTransform(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodObject) {
    const newShape: any = {}

    Object.keys(schema.shape).forEach((key) => {
      newShape[key] = deepRemoveTransform(schema.shape[key])
    })
    return new z.ZodObject({
      ...schema._def,
      shape: () => newShape,
    }) as any
  } else if (schema instanceof z.ZodArray) {
    return z.ZodArray.create(deepRemoveTransform(schema.element))
  } else if (schema instanceof z.ZodOptional) {
    return z.ZodOptional.create(deepRemoveTransform(schema.unwrap()))
  } else if (schema instanceof z.ZodNullable) {
    return z.ZodNullable.create(deepRemoveTransform(schema.unwrap()))
  } else if (schema instanceof z.ZodTuple) {
    return z.ZodTuple.create(schema.items.map((item: any) => deepRemoveTransform(item)))
  } else if (schema instanceof z.ZodUnion) {
    return z.ZodUnion.create(
      schema.options.map((type: z.ZodTypeAny) => deepRemoveTransform(type)) as readonly [
        z.ZodTypeAny,
        z.ZodTypeAny,
        ...z.ZodTypeAny[]
      ]
    )
  } else if (schema instanceof z.ZodDiscriminatedUnion) {
    throw new Error('deepRemoveTransform not implemented for discriminated union')
  } else if (schema instanceof z.ZodEffects) {
    if (schema._def.effect.type === 'transform') {
      return deepRemoveTransform(schema._def.schema)
    }
    return z.ZodEffects.create(deepRemoveTransform(schema._def.schema), schema._def.effect)
  } else {
    return schema
  }
}

/**
 * Unparse actually is just parse without transforms.  If the transforms only
 *   1. augment the data (as they are meant to in this repo) and
 *   2. objects trim undefined elements (as is default)
 * then parse without transforms will remove the data added by transformers.
 * @param schema
 * @returns
 */
export const unparse =
  <Output = any, Def extends z.ZodTypeDef = z.ZodTypeDef, Input = Output>(
    schema: z.ZodType<Output, Def, Input>
  ) =>
  (x: any): Input => {
    const noEffectZod = deepRemoveTransform(schema)
    return noEffectZod.parse(x)
  }
