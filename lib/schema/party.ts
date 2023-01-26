import { z } from 'zod'

export const Party = z.object({
  name: z.string(),
  email: z.string().email().optional(),
})
export type Party = z.infer<typeof Party>
