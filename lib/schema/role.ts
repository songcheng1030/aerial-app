import { z } from 'zod'

export const ZRole = z.object({
  admin: z.boolean(),
})
