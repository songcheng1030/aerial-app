import * as trpc from '@trpc/server'
import superjson from 'superjson'
import { z } from 'zod'

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .query('hello', {
    input: z
      .object({
        text: z.string(),
      })
      .nullish(),
    resolve: ({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    },
  })

// export type definition of API
export type AppRouter = typeof appRouter
